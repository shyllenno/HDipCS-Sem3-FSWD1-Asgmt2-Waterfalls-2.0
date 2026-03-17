import { assert } from "chai";
import { db } from "../src/models/db.js";
import { testPOIs } from "./fixtures.js";

suite("POI Model tests", () => {
  setup(async () => {
    db.init("json");
    await db.POIStore.deleteAllPOIs();
    for (let i = 0; i < testPOIs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOIs[i] = await db.POIStore.addPOI(testPOIs[i].waterfallId, testPOIs[i]);
    }
  });

  test("create a POI", async () => {
    const newPOI = await db.POIStore.addPOI(testPOIs[0].waterfallId, testPOIs[0]);
    assert.equal(newPOI, testPOIs[0]);
  });

  test("delete all POIs", async () => {
    let returnedPOIs = await db.POIStore.getAllPOIs();
    assert.equal(returnedPOIs.length, 2);
    await db.POIStore.deleteAllPOIs();
    returnedPOIs = await db.POIStore.getAllPOIs();
    assert.equal(returnedPOIs.length, 0);
  });

  test("get a POI - success", async () => {
    const POI = await db.POIStore.addPOI(testPOIs[0].waterfallId, testPOIs[0]);
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
});
