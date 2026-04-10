import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { waterfallService } from "./waterfall-service.js";
import { maggie, maggieCredentials, powerscourtWaterfall, powerscourtHouseGarden, testPOIs as base } from "../fixtures.js";

let testPOIs = [];

suite("POI API tests", () => {
  let user = null;
  let powerscourt = null;

  setup(async () => {
    waterfallService.clearAuth();
    user = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);

    await waterfallService.deleteAllWaterfalls();
    await waterfallService.deleteAllPOIs();

    testPOIs = [];

    powerscourtWaterfall.userid = user._id;
    powerscourt = await waterfallService.createWaterfall(powerscourtWaterfall);
  });

  test("create POI", async () => {
    const returnedPOI = await waterfallService.createPOI(powerscourt._id, powerscourtHouseGarden);
    assertSubset(powerscourtHouseGarden, returnedPOI);
  });

  test("create Multiple POIs", async () => {
    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOIs[i] = await waterfallService.createPOI(powerscourt._id, base[i]);
    }
    const returnedPOIs = await waterfallService.getAllPOIs();
    assert.equal(returnedPOIs.length, testPOIs.length);
    for (let i = 0; i < returnedPOIs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const poi = await waterfallService.getPOI(returnedPOIs[i]._id);
      assertSubset(poi, returnedPOIs[i]);
    }
  });

  test("Delete POIApi", async () => {
    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOIs[i] = await waterfallService.createPOI(powerscourt._id, base[i]);
    }
    let returnedPOIs = await waterfallService.getAllPOIs();
    assert.equal(returnedPOIs.length, testPOIs.length);
    for (let i = 0; i < returnedPOIs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const poi = await waterfallService.deletePOI(returnedPOIs[i]._id);
    }
    returnedPOIs = await waterfallService.getAllPOIs();
    assert.equal(returnedPOIs.length, 0);
  });

  test("denormalised waterfall", async () => {
    for (let i = 0; i < base.length; i += 1) {
      base[i].waterfallid = powerscourt._id;
      // eslint-disable-next-line no-await-in-loop
      testPOIs[i] = await waterfallService.createPOI(powerscourt._id, base[i]);
    }

    const returnedWaterfall = await waterfallService.getWaterfall(powerscourt._id);

    assert.equal(returnedWaterfall.POIs.length, testPOIs.length);
    for (let i = 0; i < testPOIs.length; i += 1) {
      assertSubset(testPOIs[i], returnedWaterfall.POIs[i]);
    }
  });

  test("update a POI via API", async () => {
    const waterfall = await waterfallService.createWaterfall({
      name: "Test Waterfall",
      description: "Test",
      latitude: 1,
      longitude: 1,
    });

    const poi = await waterfallService.createPOI(waterfall._id, {
      type: "Old Type",
      group: "Old Group",
      description: "Old Desc",
      latitude: 10,
      longitude: 20,
    });

    const updated = await waterfallService.updatePOI(poi._id, {
      type: "New Type",
      group: "New Group",
      description: "New Desc",
      latitude: 11,
      longitude: 22,
    });

    assert.equal(updated.type, "New Type");
    assert.equal(updated.group, "New Group");
  });

  test("update POI - invalid id", async () => {
    try {
      await waterfallService.updatePOI("bad-id", { type: "Nope" });
      assert.fail("Should not succeed");
    } catch (error) {
      assert.equal(error.response.data.message, "No POI with this id");
    }
  });

  test("partial update via API", async () => {
    const waterfall = await waterfallService.createWaterfall(powerscourtWaterfall);

    const poi = await waterfallService.createPOI(waterfall._id, powerscourtHouseGarden);

    const updatedPOI = structuredClone(poi);
    updatedPOI.type = "Partial";

    const updated = await waterfallService.updatePOI(poi._id, updatedPOI);

    assert.equal(updated.type, "Partial");
    assert.equal(updated.description, poi.description);
  });
});
