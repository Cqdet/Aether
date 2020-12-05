// FROM DENO: https://github.com/denoland/deno/blob/master/test_plugin/src/lib.rs

use deno_core::plugin_api::Interface;
use deno_core::plugin_api::Op;
use deno_core::plugin_api::ZeroCopyBuf;

#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
    interface.register_op("testSync", op_test_sync);
}

fn op_test_sync(_interface: &mut dyn Interface, zero_copy: &mut [ZeroCopyBuf]) -> Op {
    let result = b"Hello World";
    let result_box: Box<[u8]> = Box::new(*result);
    Op::Sync(result_box)
}
