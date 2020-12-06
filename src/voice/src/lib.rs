// FROM DENO: https://github.com/denoland/deno/blob/master/test_plugin/src/lib.rs
// ERIS/OPUSSCRIPT PORT: https://github.com/abalabahaha/opusscript
use audiopus_sys::{opus_decoder_create, opus_encoder_create};
use audiopus_sys::{opus_int16, opus_int32};
use audiopus_sys::{OpusDecoder, OpusEncoder};
use deno_core::plugin_api::Interface;
use deno_core::plugin_api::Op;
use deno_core::plugin_api::ZeroCopyBuf;

const MAX_PACKET_SIZE: i16 = 1276 * 3;
const MAX_FRAME_SIZE: i16 = 960 * 6;

#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
    interface.register_op("decode", decode);
}

pub struct OpusHandler {
    channels: i32,

    encoder: *mut OpusEncoder,
    decoder: *mut OpusDecoder,

    out: opus_int16,
}

pub trait OpusHandlerTrait {
    fn new(rate: opus_int32, channels: i16, application: i16) -> OpusHandler;
}

impl OpusHandlerTrait for OpusHandler {
    fn new(rate: opus_int32, channels: i16, application: i16) -> OpusHandler {
        unsafe {
            let encoder_error: *mut i32 = &mut 0; // I'll worry about this later
            let encoder =
                opus_encoder_create(rate, channels.into(), application.into(), encoder_error);

            let decoder_error: *mut i32 = &mut 0; // I'll worry about this later
            let decoder = opus_decoder_create(rate, channels.into(), decoder_error);

            let out: opus_int16 = MAX_FRAME_SIZE * channels * 2;
            return OpusHandler {
                channels: channels.into(),
                encoder: encoder,
                decoder: decoder,
                out: out,
            };
        }
    }
}

fn decode(_interface: &mut dyn Interface, zero_copy: &mut [ZeroCopyBuf]) -> Op {
    let result = b"Hello World";
    let result_box: Box<[u8]> = Box::new(*result);
    Op::Sync(result_box)
}
