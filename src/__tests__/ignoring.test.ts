import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for feeding a digipet.
 *
 * It is intended to test two behaviours:
 *  1. feeding a digipet leads to increasing nutrition
 *  2. feeding a digipet leads to decreasing discipline
 */

describe("When a user ignores a digipet repeatedly, all its stats decrease by 10 each time until they eventually bottom out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 25,
      nutrition: 25,
      discipline: 25,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("happiness", 25);
    expect(response.body.digipet).toHaveProperty("nutrition", 25);
    expect(response.body.digipet).toHaveProperty("discipline", 25);
  });

  test("1st GET /digipet/ignore informs them about being ignored and shows decreased stats for digipet", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 15);
    expect(response.body.digipet).toHaveProperty("nutrition", 15);
    expect(response.body.digipet).toHaveProperty("discipline", 15);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 5);
    expect(response.body.digipet).toHaveProperty("nutrition", 5);
    expect(response.body.digipet).toHaveProperty("discipline", 5);
  });

  test("3rd GET /digipet/ignore shows stats hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });

  test("4th GET /digipet/ignore shows no further stat decrease", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });
});
