const url = 'https://attendance.sixeyestech.com'

export const endpoint =  {
    logoutUser: `${url}/api/auth/logout`,
    loginUser: `${url}/api/auth/login`,
    Attend: `${url}/api/attendances`,
    AttendFace: `${url}/api/attendances?face_recognition=0`,
  }; 