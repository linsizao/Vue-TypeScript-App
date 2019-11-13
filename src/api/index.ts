import request from "@/utils/request";

export const Banks = (data: any) => request({ url: "base/Banks/list", method: "post", data });
