export const BASE_URL = "https://hijean.io.vn";
// export const BASE_URL = "http://localhost:5183";

import { HubConnectionBuilder } from "@microsoft/signalr";

export const connection = new HubConnectionBuilder()
    .withUrl(`${BASE_URL}/chatHub`, { withCredentials: true })
    .withAutomaticReconnect()
    .build();

