import { EventEmitter } from "events";
import { assert } from "chai";
import { waterfallService } from "./waterfall-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, powerscourtWaterfall, testWaterfalls } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Waterfall API tests", () => {
  let user = null;

  setup(async () => {
    await waterfallService.deleteAllWaterfalls();
    await waterfallService.deleteAllUsers();
    user = await waterfallService.createUser(maggie);
    powerscourtWaterfall.userid = user._id;
  });

  teardown(async () => {
    await waterfallService.deleteAllWaterfalls();
    await waterfallService.deleteAllUsers();
  });

  test("create waterfall", async () => {
    const returnedWaterfall = await waterfallService.createWaterfall(powerscourtWaterfall);
    assert.isNotNull(returnedWaterfall);
    assertSubset(powerscourtWaterfall, returnedWaterfall);
  });

  test("delete a waterfall", async () => {
    const waterfall = await waterfallService.createWaterfall(powerscourtWaterfall);
    const response = await waterfallService.deleteWaterfall(waterfall._id);
    assert.equal(response.status, 204);
    try {
      const returnedWaterfall = await waterfallService.getWaterfall(waterfall._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Waterfall with this id", "Incorrect Response Message");
    }
  });

  test("create multiple waterfalls", async () => {
    for (let i = 0; i < testWaterfalls.length; i += 1) {
      testWaterfalls[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await waterfallService.createWaterfall(testWaterfalls[i]);
    }
    let returnedLists = await waterfallService.getAllWaterfalls();
    assert.equal(returnedLists.length, testWaterfalls.length);
    await waterfallService.deleteAllWaterfalls();
    returnedLists = await waterfallService.getAllWaterfalls();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant waterfall", async () => {
    try {
      const response = await waterfallService.deleteWaterfall("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Waterfall with this id", "Incorrect Response Message");
    }
  });
});
