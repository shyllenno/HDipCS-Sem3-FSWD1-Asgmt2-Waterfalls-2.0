import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { waterfallService } from "./waterfall-service.js";
import { maggie, powerscourtWaterfall, powerscourtHouseGarden, testWaterfalls, testPOIs } from "../fixtures.js";

suite("POI API tests", () => {
  let user = null;
  let powerscourt = null;

  setup(async () => {
    await waterfallService.deleteAllWaterfalls();
    await waterfallService.deleteAllUsers();
    await waterfallService.deleteAllPOIs();
    user = await waterfallService.createUser(maggie);
    powerscourtWaterfall.userid = user._id;
    powerscourt = await waterfallService.createWaterfall(powerscourtWaterfall);
  });

  teardown(async () => {});

  test("create POI", async () => {
    const returnedPOI = await waterfallService.createPOI(powerscourt._id, powerscourtHouseGarden);
    assertSubset(powerscourtHouseGarden, returnedPOI);
  });

  test("create Multiple POIs", async () => {
    for (let i = 0; i < testPOIs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await waterfallService.createPOI(powerscourt._id, testPOIs[i]);
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
    for (let i = 0; i < testPOIs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await waterfallService.createPOI(powerscourt._id, testPOIs[i]);
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

  test("denormalised playlist", async () => {
    for (let i = 0; i < testPOIs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await waterfallService.createPOI(powerscourt._id, testPOIs[i]);
    }
    const returnedWaterfall = await waterfallService.getWaterfall(powerscourt._id);
    assert.equal(returnedWaterfall.POIs.length, testPOIs.length);
    for (let i = 0; i < testPOIs.length; i += 1) {
      assertSubset(testPOIs[i], returnedWaterfall.POIs[i]);
    }
  });
});