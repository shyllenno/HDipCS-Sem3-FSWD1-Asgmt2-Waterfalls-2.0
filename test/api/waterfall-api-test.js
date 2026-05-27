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

  test("update a waterfall via API", async () => {
    const waterfall = await waterfallService.createWaterfall(powerscourtWaterfall);

    const updatedFields = {
      name: "Updated API Name",
      description: "Updated API Description",
      latitude: 50.0,
      longitude: -5.0,
    };

    const updated = await waterfallService.updateWaterfall(waterfall._id, updatedFields);

    assert.equal(updated.name, updatedFields.name);
    assert.equal(updated.description, updatedFields.description);
    assert.equal(updated.latitude, updatedFields.latitude);
    assert.equal(updated.longitude, updatedFields.longitude);
  });

  test("update non-existent waterfall via API", async () => {
    try {
      await waterfallService.updateWaterfall("bad-id", { name: "Nope" });
      assert.fail("Should not succeed");
    } catch (error) {
      assert.equal(error.response.data.message, "No Waterfall with this id");
    }
  });

  test("partial update via API", async () => {
    const waterfall = await waterfallService.createWaterfall(powerscourtWaterfall);

    // References:
    // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
    const updatedWaterfall = structuredClone(waterfall);
    updatedWaterfall.name = "Partial";

    const updated = await waterfallService.updateWaterfall(waterfall._id, updatedWaterfall);

    assert.equal(updated.name, "Partial");
    assert.equal(updated.description, waterfall.description);
  });

  test("create a public waterfall", async () => {
    const waterfallData = {
      name: "Public Fall",
      description: "Visible to everyone",
      latitude: 52.1,
      longitude: -7.2,
      visibility: "Public",
      userid: user._id,
    };

    const created = await waterfallService.createWaterfall(waterfallData);
    assert.isTrue(created.visibility === "Public");

    const fetched = await waterfallService.getWaterfall(created._id);
    assert.isTrue(fetched.visibility === "Public");
  });

  test("create a private waterfall", async () => {
    const waterfallData = {
      name: "Private Fall",
      description: "Hidden from public",
      latitude: 51.9,
      longitude: -8.1,
      visibility: "Private",
      userid: user._id,
    };

    const created = await waterfallService.createWaterfall(waterfallData);
    assert.isFalse(created.visibility === "Public");

    const fetched = await waterfallService.getWaterfall(created._id);
    assert.isFalse(fetched.visibility === "Public");
  });

  test("default visibility is private", async () => {
    const waterfallData = {
      name: "Default Falls",
      description: "Should default to private",
      latitude: 50.0,
      longitude: -6.0,
      userid: user._id,
    };

    const created = await waterfallService.createWaterfall(waterfallData);
    assert.equal(created.visibility, "Private");

    const fetched = await waterfallService.getWaterfall(created._id);
    assert.equal(fetched.visibility, "Private");
  });

  test("get only public waterfalls", async () => {
    await waterfallService.deleteAllWaterfalls();

    await waterfallService.createWaterfall({ ...base[0], visibility: "Public", userid: user._id });
    await waterfallService.createWaterfall({ ...base[1], visibility: "Private", userid: user._id });

    const all = await waterfallService.getAllWaterfalls();
    const publicOnly = all.filter(w => w.visibility === "Public");

    assert.equal(publicOnly.length, 1);
    assert.equal(publicOnly[0].visibility, "Public");
  });

  test("private waterfalls are excluded from public list", async () => {
    await waterfallService.deleteAllWaterfalls();

    const privateFall = await waterfallService.createWaterfall({
      ...base[0],
      visibility: "Private",
      userid: user._id,
    });

    const all = await waterfallService.getAllWaterfalls();
    const publicOnly = all.filter(w => w.visibility === "Public");

    assert.equal(publicOnly.length, 0);

    const fetched = await waterfallService.getWaterfall(privateFall._id);
    assert.equal(fetched.visibility, "Private");
  });

  test("update waterfall visibility", async () => {
    const waterfall = await waterfallService.createWaterfall({
      ...base[0],
      visibility: "Private",
      userid: user._id,
    });

    const updatedFields = {
      ...base[0],
      visibility: "Public",
    };

    const updated = await waterfallService.updateWaterfall(waterfall._id, updatedFields);

    assert.equal(updated.visibility, "Public");

    const fetched = await waterfallService.getWaterfall(waterfall._id);
    assert.equal(fetched.visibility, "Public");
  });

  test("invalid visibility value fails validation", async () => {
    const badWaterfall = {
      name: "Bad Visibility",
      description: "Should fail",
      latitude: 52.0,
      longitude: -7.0,
      visibility: "Anything Else",
      userid: user._id,
    };

    try {
      await waterfallService.createWaterfall(badWaterfall);
      assert.fail("Should not succeed");
    } catch (error) {
      assert.include(error.response.data.message, "visibility");
    }
  });
});
