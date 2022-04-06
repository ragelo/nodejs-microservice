import { IDateServiceServer } from "./proto/date_grpc_pb";
import * as DateServiceModels from "./proto/date_pb";
import { getISODate } from "../../service/date";

export const DataServiceImplemenation: IDateServiceServer = {
  today(_, callback) {
    const date = new DateServiceModels.Date();
    date.setIso(getISODate());
    callback(null, date);
  },
};
