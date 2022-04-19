interface IDeliveryTrackParser {
  info: {
    name: string;
    tel?: string;
  },
	baseUrl: string;
  getAndParseTrackingData: (trackingId: string) => Promise<ShippingInformation>
}

type ISODateString = string;

type TrackingParserError = {
	status: number;
	message: string;
}

type ShippingInformation = {
	from: {
		name: string
		time: Date | ISODateString,
	};
	to: {
		name: string,
		time: Date | ISODateString,
	};
	state: {
		id: number | string,
		text: ISODateString,
	};
	progresses?: Progress[];
}

type Progress ={

		time: ISODateString | Date;
		location: {
			name: string;
		};
		description: string;
		status: DeliveryProgressStatus;
	
}

type DeliveryProgressStatus = {
	[key: number]:{
	id: string;
	text: string;
	}
}