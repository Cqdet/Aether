// FROM DENO: https://github.com/denoland/deno/blob/master/test_plugin/src/lib.rs
// ERIS/OPUSSCRIPT PORT: https://github.com/abalabahaha/opusscript
use audiopus_sys::{opus_decode, opus_encode};
use audiopus_sys::{opus_decoder_create, opus_decoder_ctl, opus_encoder_create, opus_encoder_ctl};
use audiopus_sys::{opus_int16, opus_int32};
use audiopus_sys::{OpusDecoder, OpusEncoder};

use wasm_bindgen::prelude::*;

const MAX_PACKET_SIZE: i16 = 1276 * 3;
const MAX_FRAME_SIZE: i16 = 960 * 6;

#[wasm_bindgen]
pub struct OpusHandler {
    _channels: i32,

    encoder: *mut OpusEncoder,
    decoder: *mut OpusDecoder,

    out: *mut opus_int16,
}

// pub struct OpusHandlerTrait {
//     fn new(rate: opus_int32, channels: i16, application: i16) -> OpusHandler;
//     fn encode(&self, input_buf: i16, bytes: i16, output_buf: i16, size: i16) -> opus_int32;
//     fn decode(&self, input_buf: i16, bytes: i16, output_buf: i16) -> opus_int32;
//     fn encoder_ctl(&self, ctl: i16, arg: i16) -> opus_int32;
//     fn decoder_ctl(&self, ctl: i16, arg: i16) -> opus_int32;
// }

#[wasm_bindgen]
impl OpusHandler {
    pub fn new(rate: opus_int32, channels: i16, application: i16) -> OpusHandler {
        unsafe {
            let encoder_error: *mut i32 = &mut 0; // I'll worry about this later
            let encoder =
                opus_encoder_create(rate, channels.into(), application.into(), encoder_error);

            let decoder_error: *mut i32 = &mut 0; // I'll worry about this later
            let decoder = opus_decoder_create(rate, channels.into(), decoder_error);

            let out: *mut opus_int16 = (MAX_FRAME_SIZE * channels * 2) as *mut opus_int16;
            return OpusHandler {
                _channels: channels.into(),
                encoder: encoder,
                decoder: decoder,
                out: out,
            };
        }
    }

    pub fn encode(&self, input_buf: i16, _bytes: i16, output_buf: i16, size: i16) -> opus_int32 {
        unsafe {
            let input: *mut opus_int16 = input_buf as *mut opus_int16;
            let output: *mut u8 = output_buf as *mut u8;

            // I will impl the rest later
            return opus_encode(
                self.encoder,
                input,
                size.into(),
                output,
                MAX_PACKET_SIZE.into(),
            );
        }
    }

    pub fn decode(&self, input_buf: i16, bytes: i16, output_buf: i16) -> opus_int32 {
        unsafe {
            let input: *mut u8 = input_buf as *mut u8;
            let _pcm: i16 = output_buf;
            let len = opus_decode(
                self.decoder,
                input,
                bytes.into(),
                self.out,
                MAX_PACKET_SIZE.into(),
                0,
            );

            // I will impl the rest later

            return len;
        }
    }

    fn _encoder_ctl(&self, ctl: i16, arg: i16) -> opus_int32 {
        unsafe {
            return opus_encoder_ctl(self.encoder, ctl.into(), arg as std::os::raw::c_int);
        }
    }

    fn _decoder_ctl(&self, ctl: i16, arg: i16) -> opus_int32 {
        unsafe {
            return opus_decoder_ctl(self.decoder, ctl.into(), arg as std::os::raw::c_int);
        }
    }
}
