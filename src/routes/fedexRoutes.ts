import { Router } from "express";
import {
  cancelShipmentController,
  cancelTagController,
  createShipmentController,
  createTagController,
  rateAndTimeController,
  retrieveShipmentController,
  trackApiController,
  trackNotificationsController,
  trackShipmentController,
  validateAddressController,
  validatePostalCodeController,
  validateShipmentController,
} from "../controllers/FedexController";

export const fedexRoutes = Router();

fedexRoutes
  .post("/rates-and-transit-times-api", rateAndTimeController)
  .post("/track-api", trackApiController)
  .post("/track-shipment", trackShipmentController)
  .post("/track-notifications", trackNotificationsController)

  .post("/create-shipment", createShipmentController)
  .put("/cancel-shipment", cancelShipmentController)
  .post("/retrieve-shipment", retrieveShipmentController)
  .post("/validate-shipment", validateShipmentController)
  .post("/create-tag", createTagController)
  .put("/cancel-tag", cancelTagController)

  .post("/validate-address", validateAddressController)
  .post("/validate-postal-code", validatePostalCodeController);
