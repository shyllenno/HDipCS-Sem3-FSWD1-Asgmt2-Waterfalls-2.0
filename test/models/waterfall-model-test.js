import { assert } from "chai";
import Joi from "joi";
import { EventEmitter } from "events";
import { db } from "../../src/models/db.js";
import { testWaterfalls as base } from "../fixtures.js";
import { WaterfallSpec, POISpec } from "../../src/models/joi-schemas.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(10000);

suiteSetup(async () => {
  await db.init("mongo");
});

suiteTeardown(async () => {
  await db.close();
});

let testWaterfalls = [];

suite("Waterfall Model tests", () => {
  setup(async () => {
    await db.waterfallStore.deleteAllWaterfalls();

    testWaterfalls = [];

    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testWaterfalls[i] = await db.waterfallStore.addWaterfall({ ...base[i] });
    }
  });

  test("create a waterfall", async () => {
    const newWaterfall = await db.waterfallStore.addWaterfall(base[0]);
    const getWaterfall = await db.waterfallStore.getWaterfallById(newWaterfall._id);
    assertSubset(getWaterfall, newWaterfall);
  });

  test("delete all waterfalls", async () => {
    let returnedWaterfalls = await db.waterfallStore.getAllWaterfalls();
    assert.equal(returnedWaterfalls.length, testWaterfalls.length);
    await db.waterfallStore.deleteAllWaterfalls();
    returnedWaterfalls = await db.waterfallStore.getAllWaterfalls();
    assert.equal(returnedWaterfalls.length, 0);
  });

  test("get a waterfall - success", async () => {
    const waterfall = await db.waterfallStore.addWaterfall(base[0]);
    const returnedWaterfall = await db.waterfallStore.getWaterfallById(waterfall._id);
    assertSubset(waterfall, returnedWaterfall);
  });

  test("delete One waterfall - success", async () => {
    await db.waterfallStore.deleteWaterfallById(testWaterfalls[0]._id);
    const returnedWaterfalls = await db.waterfallStore.getAllWaterfalls();
    assert.equal(returnedWaterfalls.length, testWaterfalls.length - 1);
    const deletedWaterfall = await db.waterfallStore.getWaterfallById(testWaterfalls[0]._id);
    assert.isNull(deletedWaterfall);
  });

  test("get a waterfall - failures", async () => {
    const noWaterfallWithId = await db.waterfallStore.getWaterfallById("123");
    assert.isNull(noWaterfallWithId);
  });

  test("get a waterfall - bad params", async () => {
    let nullWaterfall = await db.waterfallStore.getWaterfallById("");
    assert.isNull(nullWaterfall);
    nullWaterfall = await db.waterfallStore.getWaterfallById();
    assert.isNull(nullWaterfall);
  });

  test("delete One waterfall - fail", async () => {
    await db.waterfallStore.deleteWaterfallById("bad-id");
    const returnedWaterfalls = await db.waterfallStore.getAllWaterfalls();
    assert.equal(returnedWaterfalls.length, testWaterfalls.length);
  });

  test("create a waterfall with coordinates", async () => {
    const waterfallData = {
      name: "Powerscourt Waterfall",
      description: "Powerscourt Waterfall is the highest waterfall in Ireland",
      latitude: 53.15,
      longitude: -6.18,
      visibility: "Private",
    };
    const newWaterfall = await db.waterfallStore.addWaterfall(waterfallData);
    assert.equal(newWaterfall.latitude, 53.15);
    assert.equal(newWaterfall.longitude, -6.18);
  });

  test("handle edge case coordinates", async () => {
    let edgeCaseWaterfall = {
      name: "Edge Waterfall",
      description: "A waterfall with edge case coordinates, should be created",
      latitude: 90.0,
      longitude: 180.0,
      visibility: "Private",
    };
    let returned = await db.waterfallStore.addWaterfall(edgeCaseWaterfall);
    assert.equal(returned.latitude, 90.0);
    assert.equal(returned.longitude, 180.0);

    edgeCaseWaterfall = {
      name: "Edge Waterfall",
      description: "A waterfall with edge case coordinates, should be created",
      latitude: -90.0,
      longitude: -180.0,
      visibility: "Private",
    };
    returned = await db.waterfallStore.addWaterfall(edgeCaseWaterfall);
    assert.equal(returned.latitude, -90.0);
    assert.equal(returned.longitude, -180.0);

    edgeCaseWaterfall = {
      name: "Edge Waterfall",
      description: "A waterfall with edge case coordinates, should be created",
      latitude: 90.0,
      longitude: -180.0,
      visibility: "Private",
    };
    returned = await db.waterfallStore.addWaterfall(edgeCaseWaterfall);
    assert.equal(returned.latitude, 90.0);
    assert.equal(returned.longitude, -180.0);

    edgeCaseWaterfall = {
      name: "Edge Waterfall",
      description: "A waterfall with edge case coordinates, should be created",
      latitude: -90.0,
      longitude: 180.0,
      visibility: "Private",
    };
    returned = await db.waterfallStore.addWaterfall(edgeCaseWaterfall);
    assert.equal(returned.latitude, -90.0);
    assert.equal(returned.longitude, 180.0);
  });

  test("create a waterfall - invalid coordinates", async () => {
    const badWaterfall = {
      name: "Impossible Waterfall",
      description: "Impossible coordinates, should not be created",
      latitude: 150.0,
      longitude: -200.0,
      visibility: "Private",
    };
    const validation = WaterfallSpec.validate(badWaterfall);

    if (validation.error) {
      const result = null;
      assert.isNull(result, "Should not create waterfall with out-of-bounds coordinates");
    } else {
      result = await db.waterfallStore.addWaterfall(badWaterfall);
    }

    const allWaterfalls = await db.waterfallStore.getAllWaterfalls();
    assert.equal(allWaterfalls.length, testWaterfalls.length);
  });

  test("create a waterfall - out of bounds coordinates", async () => {
    const badMinusLatitude = {
      name: "Bad Waterfall",
      description: "Should fail",
      latitude: -91,
      longitude: 0,
      visibility: "Private",
    };
    let validation = WaterfallSpec.validate(badMinusLatitude);
    assert.isDefined(validation.error, "Should have a validation error for latitude < -90");

    const badPlusLatitude = {
      name: "Bad Waterfall",
      description: "Should fail",
      latitude: 91,
      longitude: 0,
      visibility: "Private",
    };
    validation = WaterfallSpec.validate(badPlusLatitude);
    assert.isDefined(validation.error, "Should have a validation error for latitude > 90");

    const badMinusLongitude = {
      name: "Bad Waterfall",
      description: "Should fail",
      latitude: 0,
      longitude: -181,
      visibility: "Private",
    };
    validation = WaterfallSpec.validate(badMinusLongitude);
    assert.isDefined(validation.error, "Should have a validation error for longitude < -180");

    const badPlusLongitude = {
      name: "Bad Waterfall",
      description: "Should fail",
      latitude: -100,
      longitude: 181,
      visibility: "Private",
    };
    validation = WaterfallSpec.validate(badPlusLongitude);
    assert.isDefined(validation.error, "Should have a validation error for longitude > 180");
  });

  test("create a waterfall - valid coordinates", async () => {
    const goodCoordinates = {
      name: "Good Waterfall",
      description: "A good waterfall, it should pass",
      latitude: 52.3,
      longitude: -7.5,
      visibility: "Private",
    };

    const validation = WaterfallSpec.validate(goodCoordinates);

    assert.isUndefined(validation.error, "Should not have errors for valid coordinates");
  });

  test("retrieve coordinates correctly", async () => {
    const waterfall = await db.waterfallStore.getWaterfallById(testWaterfalls[0]._id);
    assert.property(waterfall, "latitude");
    assert.property(waterfall, "longitude");
    assert.isNumber(waterfall.latitude);
    assert.isNumber(waterfall.longitude);
  });

  test("update waterfall coordinates", async () => {
    const waterfall = testWaterfalls[0];
    waterfall.latitude = 52.0;
    waterfall.longitude = -7.0;

    await db.waterfallStore.deleteWaterfallById(waterfall._id);
    const updatedWaterfall = await db.waterfallStore.addWaterfall(waterfall);

    assert.equal(updatedWaterfall.latitude, 52.0);
    assert.equal(updatedWaterfall.longitude, -7.0);
  });

  test("update a waterfall - success", async () => {
    const waterfall = testWaterfalls[0];

    const updatedFields = {
      name: "Updated Name",
      description: "Updated Description",
      latitude: 51.9,
      longitude: -8.4,
    };

    const updatedWaterfall = await db.waterfallStore.updateWaterfall(waterfall._id, updatedFields);
    const returnedWaterfall = await db.waterfallStore.getWaterfallById(waterfall._id);

    assert.equal(returnedWaterfall.name, updatedFields.name);
    assert.equal(returnedWaterfall.description, updatedFields.description);
    assert.equal(returnedWaterfall.latitude, updatedFields.latitude);
    assert.equal(returnedWaterfall.longitude, updatedFields.longitude);
  });

  test("update a waterfall - non-existent id", async () => {
    const updated = await db.waterfallStore.updateWaterfall("bad-id", { name: "Should Not Work" });
    assert.isNull(updated);
  });

  test("update a waterfall - partial update", async () => {
    const waterfall = testWaterfalls[1];

    const updatedFields = { name: "Partially Updated" };

    await db.waterfallStore.updateWaterfall(waterfall._id, updatedFields);
    const returned = await db.waterfallStore.getWaterfallById(waterfall._id);

    assert.equal(returned.name, "Partially Updated");
    assert.equal(returned.description, waterfall.description);
  });

  test("create a public waterfall", async () => {
    const waterfallData = {
      name: "Public Fall",
      description: "Visible to everyone",
      latitude: 52.1,
      longitude: -7.2,
      visibility: "Public",
    };

    const newWaterfall = await db.waterfallStore.addWaterfall(waterfallData);
    assert.isTrue(newWaterfall.visibility === "Public");

    const fetched = await db.waterfallStore.getWaterfallById(newWaterfall._id);
    assert.isTrue(fetched.visibility === "Public");
  });

  test("create a private waterfall", async () => {
    const waterfallData = {
      name: "Private Fall",
      description: "Hidden from public",
      latitude: 51.9,
      longitude: -8.1,
      visibility: "Private"
    };

    const newWaterfall = await db.waterfallStore.addWaterfall(waterfallData);
    assert.isFalse(newWaterfall.visibility === "Public");

    const fetched = await db.waterfallStore.getWaterfallById(newWaterfall._id);
    assert.isFalse(fetched.visibility === "Public");
  });

  test("default visibility is private", async () => {
    const waterfallData = {
      name: "Default Falls",
      description: "Should default to private",
      latitude: 50.0,
      longitude: -6.0,
    };

    const newWaterfall = await db.waterfallStore.addWaterfall(waterfallData);
    assert.isTrue(newWaterfall.visibility === "Private", "Default visibility should be private");
  });

  test("get only public waterfalls", async () => {
    await db.waterfallStore.deleteAllWaterfalls();

    await db.waterfallStore.addWaterfall({ ...base[0], visibility: "Public" });
    await db.waterfallStore.addWaterfall({ ...base[1], visibility: "Private" });

    const allWaterfalls = await db.waterfallStore.getAllWaterfalls();
    const publicWaterfalls = allWaterfalls.filter(w => w.visibility === "Public");

    assert.equal(publicWaterfalls.length, 1);
    assert.isTrue(publicWaterfalls[0].visibility === "Public");
  });

  test("private waterfalls are excluded from public list", async () => {
    await db.waterfallStore.deleteAllWaterfalls();

    const privateWaterfall = await db.waterfallStore.addWaterfall({
      ...base[0],
      visibility: "Private",
    });

    const allWaterfalls = await db.waterfallStore.getAllWaterfalls();
    const publicWaterfalls = allWaterfalls.filter(w => w.visibility === "Public");

    assert.equal(publicWaterfalls.length, 0);
    const fetched = await db.waterfallStore.getWaterfallById(privateWaterfall._id);
    assert.isFalse(fetched.visibility === "Public");
  });

  test("update waterfall visibility", async () => {
    const waterfall = await db.waterfallStore.addWaterfall({
      ...base[0],
      visibility: "Private",
    });

    const updated = await db.waterfallStore.updateWaterfall(waterfall._id, {
      visibility: "Public",
    });

    assert.isTrue(updated.visibility === "Public");

    const fetched = await db.waterfallStore.getWaterfallById(waterfall._id);
    assert.isTrue(fetched.visibility === "Public");
  });

  test("invalid visibility value fails validation", async () => {
    const badWaterfall = {
      name: "Bad Visibility",
      description: "Should fail",
      latitude: 52.0,
      longitude: -7.0,
      visibility: "Anything Else",
    };

    const validation = WaterfallSpec.validate(badWaterfall);
    assert.isDefined(validation.error, "Should reject visibility values rather than Public and Private");
  });


});
