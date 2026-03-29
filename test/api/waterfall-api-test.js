import { EventEmitter } from "events";
import { assert } from "chai";
import { waterfallService } from "./waterfall-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, powerscourtWaterfall, testWaterfalls as base } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

let testWaterfalls = [];

suite("Waterfall API tests", () => {
  let user = null;

  setup(async () => {
    waterfallService.clearAuth();
    user = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);

    await waterfallService.deleteAllWaterfalls();
    testWaterfalls = [];

    powerscourtWaterfall.userid = user._id;
  });

  teardown(async () => {
    await waterfallService.deleteAllWaterfalls();
    testWaterfalls = [];
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
    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testWaterfalls[i] = await waterfallService.createWaterfall(base[i]);
      testWaterfalls[i].userid = user._id;
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
