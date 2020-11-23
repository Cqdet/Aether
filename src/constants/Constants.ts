export type Payload = {
	/** OP Code */
	op: number;
	/** Event Data */
	d: any;
	/** Sequence Number */
	s?: number;
	/** Event Name */
	t?: string;
};
