import request from '@/utils/request'
export function deviceList(data) {
  return request({
    url: '/device/list',
    data
  })
}

export function deviceSelect(data) {
    return request({
        url: '/device/select',
        data
    })
}


export function createDevice(data) {
  return request({
    url: '/device/update',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: '/device/update',
    data
  })
}

export function fileQrcode(data) {
  return request({
    url: '/file/qrcode',
    data
  })
}