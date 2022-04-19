/* eslint-disable no-unused-vars */
import { Axios } from 'axios';

type ISODateString = string;

type DeliveryProgressState = {
  id: string;
  text: string;
};
export type DeliveryProgressStatusMap = {
  [key: string | number]: DeliveryProgressState;
};

export type Progress = {
  time: ISODateString | Date;
  location: {
    name: string;
  };
  description: string;
  status: DeliveryProgressState;
};

export type TrackingParserError = {
  status: number;
  message: string;
};

export type TrackingInformation = {
  from: {
    name?: string | undefined | null;
    time?: Date | ISODateString | undefined | null;
  };
  to: {
    name?: string | undefined | null;
    time?: Date | ISODateString | undefined | null;
  };
  state: DeliveryProgressState;
  progresses?: Progress[];
};

export interface IDeliveryTrackParser {
  baseUrl: string;

  getTrackingData: (params: {
    trackingId: string;
    query?: { [key: string]: string };
  }) => Axios;

  getAndParseTrackingData?: (
    trackingId: string
  ) => Promise<TrackingInformation | TrackingParserError>;
}
