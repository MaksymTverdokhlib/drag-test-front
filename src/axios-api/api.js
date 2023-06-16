// import { serverUrl } from "@/constants";
import axios from "axios";


export class ApiBox {
  static async getBoxParameters() {
    return await axios.get(
      `${process.env.NEXT_PUBLIC_BASIC_API_URL}/box/parameters`
    );
  }

  static async createBox(data) {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_BASIC_API_URL}/box/create`,
      data
    );
  }

  static async updateBoxProperties(data) {
    return await axios.patch(
      `${process.env.NEXT_PUBLIC_BASIC_API_URL}/box/parameters`,
      data
    );
  }

  static async updateBoxCoordinates(data) {
    return await axios.patch(
      `${process.env.NEXT_PUBLIC_BASIC_API_URL}/box/coordinates`,
      data
    );
  }
}
