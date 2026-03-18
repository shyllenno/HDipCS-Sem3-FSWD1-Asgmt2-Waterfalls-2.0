import { assert } from "chai";
import Joi from "joi";
import { db } from "../src/models/db.js";
import { testPOIs as base } from "./fixtures.js";
import { POISpec } from "../src/models/joi-schemas.js";
import { assertSubset } from "./test-utils.js";

let testPOIs = [];

suite("POI Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.POIStore.deleteAllPOIs();

    testPOIs = [];
    
    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOIs[i] = await db.POIStore.addPOI({ ...base[i] });
    }
  });

  test("create a POI", async () => {
    const newPOI = await db.POIStore.addPOI(base[0]);
    const getPOI = await db.POIStore.getPOIById(newPOI._id);
    assertSubset(getPOI, newPOI);
  });

  test("delete all POIs", async () => {
    let returnedPOIs = await db.POIStore.getAllPOIs();
    assert.equal(returnedPOIs.length, 2);
    await db.POIStore.deleteAllPOIs();
    returnedPOIs = await db.POIStore.getAllPOIs();
    assert.equal(returnedPOIs.length, 0);
  });

  test("get a POI - success", async () => {
    const POI = await db.POIStore.addPOI(base[0]);
    const returnedPOI = await db.POIStore.getPOIById(POI._id);
    assert.deepEqual(POI, returnedPOI);
  });

  test("delete One POI - success", async () => {
    await db.POIStore.deletePOIById(testPOIs[0]._id);
    const returnedPOIs = await db.POIStore.getAllPOIs();
    assert.equal(returnedPOIs.length, testPOIs.length - 1);
    const deletedPOI = await db.POIStore.getPOIById(testPOIs[0]._id);
    assert.isNull(deletedPOI);
  });

  test("get a POI - failures", async () => {
    const noPOIWithId = await db.POIStore.getPOIById("123");
    assert.isNull(noPOIWithId);
  });

  test("get a POI - bad params", async () => {
    let nullPOI = await db.POIStore.getPOIById("");
    assert.isNull(nullPOI);
    nullPOI = await db.POIStore.getPOIById();
    assert.isNull(nullPOI);
  });

  test("delete One POI - fail", async () => {
    await db.POIStore.deletePOIById("bad-id");
    const returnedPOIs = await db.POIStore.getAllPOIs();
    assert.equal(returnedPOIs.length, testPOIs.length);
  });

  test("create a POI with coordinates", async () => {
    const POIData = {
      type: "Powerscourt Waterfall",
      description: "Powerscourt Waterfall is the highest waterfall in Ireland",
      latitude: 53.15,
      longitude: -6.18,
    };
    const newPOI = await db.POIStore.addPOI(POIData);
    assert.equal(newPOI.latitude, 53.15);
    assert.equal(newPOI.longitude, -6.18);
  });

  test("handle edge case coordinates", async () => {
    let edgeCasePOI = {
      type: "Edge POI",
      description: "A POI with edge case coordinates, should be created",
      latitude: 90.0,
      longitude: 180.0,
    };
    let returned = await db.POIStore.addPOI(edgeCasePOI);
    assert.equal(returned.latitude, 90.0);
    assert.equal(returned.longitude, 180.0);

    edgeCasePOI = {
      type: "Edge POI",
      description: "A POI with edge case coordinates, should be created",
      latitude: -90.0,
      longitude: -180.0,
    };
    returned = await db.POIStore.addPOI(edgeCasePOI);
    assert.equal(returned.latitude, -90.0);
    assert.equal(returned.longitude, -180.0);

    edgeCasePOI = {
      type: "Edge POI",
      description: "A POI with edge case coordinates, should be created",
      latitude: 90.0,
      longitude: -180.0,
    };
    returned = await db.POIStore.addPOI(edgeCasePOI);
    assert.equal(returned.latitude, 90.0);
    assert.equal(returned.longitude, -180.0);

    edgeCasePOI = {
      type: "Edge POI",
      description: "A POI with edge case coordinates, should be created",
      latitude: -90.0,
      longitude: 180.0,
    };
    returned = await db.POIStore.addPOI(edgeCasePOI);
    assert.equal(returned.latitude, -90.0);
    assert.equal(returned.longitude, 180.0);
  });

  test("create a POI - invalid coordinates", async () => {
    const badPOI = {
      type: "Impossible POI",
      description: "Impossible coordinates, should not be created",
      latitude: 150.0,
      longitude: -200.0,
    };
    const schema = Joi.object(POISpec);
    const validation = schema.validate(badPOI);

    if (validation.error) {
      const result = null;
      assert.isNull(result, "Should not create POI with out-of-bounds coordinates");
    } else {
      result = await db.POIStore.addPOI(badPOI);
    }

    const allPOIs = await db.POIStore.getAllPOIs();
    assert.equal(allPOIs.length, testPOIs.length);
  });

  test("create a POI - out of bounds coordinates", async () => {
    const schema = Joi.object(POISpec);

    const badMinusLatitude = {
      type: "Bad POI",
      description: "Should fail",
      latitude: -91,
      longitude: 0,
    };
    let validation = schema.validate(badMinusLatitude);
    assert.isDefined(validation.error, "Should have a validation error for latitude < -90");

    const badPlusLatitude = {
      type: "Bad POI",
      description: "Should fail",
      latitude: 91,
      longitude: 0,
    };
    validation = schema.validate(badPlusLatitude);
    assert.isDefined(validation.error, "Should have a validation error for latitude > 90");

    const badMinusLongitude = {
      type: "Bad POI",
      description: "Should fail",
      latitude: 0,
      longitude: -181,
    };
    validation = schema.validate(badMinusLongitude);
    assert.isDefined(validation.error, "Should have a validation error for longitude < -180");

    const badPlusLongitude = {
      type: "Bad POI",
      description: "Should fail",
      latitude: -100,
      longitude: 181,
    };
    validation = schema.validate(badPlusLongitude);
    assert.isDefined(validation.error, "Should have a validation error for longitude > 180");
  });

  test("create a POI - valid coordinates", async () => {
    const goodCoordinates = {
      type: "Good POI",
      description: "A good POI, it should pass",
      latitude: 52.3,
      longitude: -7.5,
    };

    const schema = Joi.object(POISpec);
    const validation = schema.validate(goodCoordinates);

    assert.isUndefined(validation.error, "Should not have errors for valid coordinates");
  });

  test("retrieve coordinates correctly", async () => {
    const POI = await db.POIStore.getPOIById(testPOIs[0]._id);
    assert.property(POI, "latitude");
    assert.property(POI, "longitude");
    assert.isNumber(POI.latitude);
    assert.isNumber(POI.longitude);
  });

  test("update POI coordinates", async () => {
    const POI = testPOIs[0];
    POI.latitude = 52.0;
    POI.longitude = -7.0;

    await db.POIStore.deletePOIById(POI._id);
    const updatedPOI = await db.POIStore.addPOI(POI);

    assert.equal(updatedPOI.latitude, 52.0);
    assert.equal(updatedPOI.longitude, -7.0);
  });
});
