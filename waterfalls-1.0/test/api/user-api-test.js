import { assert } from "chai";
import { waterfallService } from "./waterfall-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers as base } from "../fixtures.js";
import { db } from "../../src/models/db.js";
import { decodeToken } from "../../src/api/jwt-utils.js";

let testUsers = [];

suite("User API tests", () => {
  setup(async () => {
    waterfallService.clearAuth();
    await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggie);
    await waterfallService.deleteAllUsers();
    testUsers = [];

    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await waterfallService.createUser(base[i]);
    }
  });
  teardown(async () => {});

  test("create a user", async () => {
    const newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggie);

    const getNewUser = await waterfallService.getUser(newUser._id);
    assertSubset(newUser, getNewUser);
    assert.isDefined(getNewUser._id);
  });

  test("delete all users", async () => {
    const newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggie);
    let returnedUsers = await waterfallService.getUsers();
    assert.equal(returnedUsers.length, 4);
    await waterfallService.deleteAllUsers();
    returnedUsers = await waterfallService.getUsers();
    assert.equal(returnedUsers.length, 0);
  });

  test("get a user - success", async () => {
    const returnedUser = await waterfallService.getUser(testUsers[0]._id);
    assert.deepEqual(testUsers[0], returnedUser);
  });

  test("get a user - fail", async () => {
    try {
      const returnedUser = await waterfallService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a user - deleted user", async () => {
    const newUser = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggie);
    await waterfallService.deleteAllUsers();
    try {
      const returnedUser = await waterfallService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
