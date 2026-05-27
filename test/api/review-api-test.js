import { EventEmitter } from "events";
import { assert } from "chai";
import { waterfallService } from "./waterfall-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, powerscourtWaterfall } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Review API tests", () => {
  let user = null;
  let waterfall = null;

  setup(async () => {
    waterfallService.clearAuth();
    user = await waterfallService.createUser(maggie);
    await waterfallService.authenticate(maggieCredentials);

    await waterfallService.deleteAllWaterfalls();
    await waterfallService.deleteAllReviews();

    powerscourtWaterfall.userid = user._id;
    waterfall = await waterfallService.createWaterfall(powerscourtWaterfall);
  });

  test("create a review", async () => {
    const reviewData = {
      rating: 5,
      comment: "Amazing!",
      userid: user._id,
    };

    const review = await waterfallService.createReview(waterfall._id, reviewData);

    assert.isNotNull(review);
    assertSubset(reviewData, review);
  });

  test("get reviews for a waterfall", async () => {
    await waterfallService.createReview(waterfall._id, {
      rating: 4,
      comment: "Nice place",
      userid: user._id,
    });

    await waterfallService.createReview(waterfall._id, {
      rating: 3,
      comment: "Good but crowded",
      userid: user._id,
    });

    const reviews = await waterfallService.getReviews(waterfall._id);

    assert.equal(reviews.length, 2);
  });

  test("delete a review", async () => {
    const review = await waterfallService.createReview(waterfall._id, {
      rating: 5,
      comment: "To be deleted",
      userid: user._id,
    });

    const response = await waterfallService.deleteReview(review._id);
    assert.equal(response.status, 204);

    const reviews = await waterfallService.getReviews(waterfall._id);
    assert.equal(reviews.length, 0);
  });

  test("delete non-existent review", async () => {
    try {
      await waterfallService.deleteReview("bad-id");
      assert.fail("Should not succeed");
    } catch (error) {
      assert.equal(error.response.data.message, "No Review with this id");
    }
  });

  test("average rating calculation", async () => {
    await waterfallService.createReview(waterfall._id, {
      rating: 5,
      comment: "Great",
      userid: user._id,
    });

    await waterfallService.createReview(waterfall._id, {
      rating: 3,
      comment: "Okay",
      userid: user._id,
    });

    const stats = await waterfallService.getAverageRating(waterfall._id);

    assert.equal(stats.avg, 4);
    assert.equal(stats.count, 2);
  });

  test("average rating with no reviews", async () => {
    const stats = await waterfallService.getAverageRating(waterfall._id);

    assert.equal(stats.avg, 0);
    assert.equal(stats.count, 0);
  });

  test("create review - invalid rating", async () => {
    try {
      await waterfallService.createReview(waterfall._id, {
        rating: 999,
        comment: "Impossible rating",
        userid: user._id,
      });
      assert.fail("Should not succeed");
    } catch (error) {
      assert.include(error.response.data.message, "rating");
    }
  });

});
