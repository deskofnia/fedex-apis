import { RequestHandler } from "express";
import { Request, Response } from "express";
import {
  createShipmentService,
  rateAndTimeService,
  trackApiService,
  trackNotificationsService,
  trackShipmentService,
  validateAddressService,
  validateShipmentService,
} from "../services/FedexServices";

export const rateAndTimeController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  rateAndTimeService(req, res);
};

export const trackApiController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  trackApiService(req, res);
};

export const trackShipmentController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  trackShipmentService(req, res);
};
export const trackNotificationsController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  trackNotificationsService(req, res);
};

export const createShipmentController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  createShipmentService(req, res);
};
export const cancelShipmentController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  trackNotificationsService(req, res);
};
export const retrieveShipmentController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  trackNotificationsService(req, res);
};
export const createTagController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  trackNotificationsService(req, res);
};
export const cancelTagController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  trackNotificationsService(req, res);
};

export const validateShipmentController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  validateShipmentService(req, res);
};

export const validateAddressController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  validateAddressService(req, res);
};

export const validatePostalCodeController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  validateShipmentService(req, res);
};
