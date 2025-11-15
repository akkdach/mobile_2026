export const myErrorHandler = (error: Error) => {
    console.log("[MESSAGE]===>", error.message)
    switch (error.message) {
        case "Network Error":
            return "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
            break;
        case "Request failed with status code 400":
            return "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
            break;
        default:
        // code block
    }

}