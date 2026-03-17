import { assert } from "chai";
import { db } from "../src/models/db.js"; 
import { testWaterfalls } from "./fixtures.js";

suite("Waterfall Model tests", () => {
  setup(async () => {
    db.init("json");
    await db.waterfallStore.deleteAllWaterfalls();
    for (let i = 0; i < testWaterfalls.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testWaterfalls[i] = await db.waterfallStore.addWaterfall(testWaterfalls[i]);
    }
  });

  test("create a waterfall", async () => {
    const newWaterfall = await db.waterfallStore.addWaterfall(testWaterfalls[0]);
    assert.equal(newWaterfall, testWaterfalls[0]);
  });

  test("delete all waterfalls", async () => {
    let returnedWaterfalls = await db.waterfallStore.getAllWaterfalls();
    assert.equal(returnedWaterfalls.length, 1);
    await db.waterfallStore.deleteAllWaterfalls();
    returnedWaterfalls = await db.waterfallStore.getAllWaterfalls();
    assert.equal(returnedWaterfalls.length, 0);
  });

  test("get a waterfall - success", async () => {
    const waterfall = await db.waterfallStore.addWaterfall(testWaterfalls[0]);
    const returnedWaterfall = await db.waterfallStore.getWaterfallById(waterfall._id);
    assert.deepEqual(waterfall, returnedWaterfall);
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
}); 