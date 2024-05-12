const url = 'https://attendance.sixeyestech.com'

export const endpoint =  {
    logoutUser: `${url}/api/auth/logout`,
    loginUser: `${url}/api/auth/login`,
    Attend: `${url}/api/attendances`,
    AttendDetail: (id) => `${url}/api/attendances/${id}`,
    AttendFace: `${url}/api/attendances?face_recognition=0`,
    Profile: `${url}/api/me`,
  }; 