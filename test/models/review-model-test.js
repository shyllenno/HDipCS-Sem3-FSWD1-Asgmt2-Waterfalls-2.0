import { assert } from "chai";
import Joi from "joi";
import { EventEmitter } from "events";
import { db } from "../../src/models/db.js";
import { maggie, powerscourtWaterfall, testReviews as base } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(10000);

suiteSetup(async () => {
  await db.init("mongo");
});

suiteTeardown(async () => {
  await db.close();
});

let testReviews = [];
let waterfall = null;
let user = null;

suite("Review Model tests", () => {

  setup(async () => {
    await db.waterfallStore.deleteAllWaterfalls();
    await db.reviewStore.deleteAllReviews();


    user = maggie;
    waterfall = await db.waterfallStore.addWaterfall(powerscourtWaterfall);

    testReviews = [];

    for (let i = 0; i < base.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testReviews[i] = await db.reviewStore.addReview({ ...base[i], userid: user._id, waterfallid: waterfall._id });
    }
  });

  test("create a review", async () => {
    const newReview = await db.reviewStore.addReview({ ...base[0], userid: user._id, waterfallid: waterfall._id });
    const getReview = await db.reviewStore.getReviewById(newReview._id);
    assertSubset(getReview, newReview);
  });

  test("get reviews for a waterfall", async () => {
    const newReview1 = await db.reviewStore.addReview({ ...base[0], userid: user._id, waterfallid: waterfall._id });
    const newReview2 = await db.reviewStore.addReview({ ...base[1], userid: user._id, waterfallid: waterfall._id });

    const reviews = await db.reviewStore.getReviewsByWaterfallId(waterfall._id);
    assert.equal(reviews.length, 5);
  });

  test("delete a review", async () => {
    const review = await db.reviewStore.addReview({ ...base[0], userid: user._id, waterfallid: waterfall._id });

    await db.reviewStore.deleteReviewById(review._id);

    const reviews = await db.reviewStore.getReviewsByWaterfallId(waterfall._id);
    assert.equal(reviews.length, 3);
  });

  test("delete review - invalid id", async () => {
    await db.reviewStore.deleteReviewById("bad-id");

    const reviews = await db.reviewStore.getReviewsByWaterfallId(waterfall._id);
    assert.equal(reviews.length, 3);
  });

  test("average rating - correct calculation", async () => {

    const stats = await db.reviewStore.getAverageRating(waterfall._id);

    assert.equal(stats.avg, 3);   // (5 + 3 + 1) / 3
    assert.equal(stats.count, 3);
  });

  test("average rating - no reviews", async () => {
    await db.reviewStore.deleteAllReviews();
    const stats = await db.reviewStore.getAverageRating(waterfall._id);
    assert.equal(stats.avg, 0);
    assert.equal(stats.count, 0);
  });

  test("get reviews - invalid waterfall id", async () => {
    const reviews = await db.reviewStore.getReviewsByWaterfallId("bad-id");
    assert.isNull(reviews, "Should return null for invalid waterfall id");
  });

});
