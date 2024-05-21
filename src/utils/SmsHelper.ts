import axios from "axios";
import { StatusCodes } from "http-status-codes";
import ApiErr from "./ApiErr";

class SmsHelper {
  private receptor: string;

  constructor(receptor: string) {
    this.receptor = receptor;
  }

  private generateURL(template: string) {
    return new URL(
      `https://api.kavenegar.com/v1/${process.env.SMS_API}/verify/lookup.json?sender=10006606600066&template=${template}&receptor=${this.receptor}`
    );
  }

  public async sendOTP(code: string) {
    try {
      // if (process.env.NODE_ENV === "dev") return;
      const url = this.generateURL("Verify");
      url.searchParams.append("token", code);
      const data = await axios.get(url.href);
      //(data.data.return.status)
      if (data.data.return.status === 200) {
        return true;
      }

      throw new ApiErr(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "خطا در بخش ارسال اس ام اس"
      );
    } catch (error: any) {
      console.log(error);
    }
  }

  public async sendWelcomeMessage() {
    try {
      // if (process.env.NODE_ENV === "dev") return;
      const url = this.generateURL("welcome");
      url.searchParams.append("token", "کاربر");
      const data = await axios.get(url.href);
      //(data.data.return.status)
      if (data.data.return.status === 200) {
        return true;
      }

      throw new ApiErr(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "خطا در بخش ارسال اس ام اس"
      );
    } catch (error: any) {
      console.log(error);
    }
  }
}

export default SmsHelper;
