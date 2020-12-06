# Aether Voice

## How to use

As of now (12-6-2020), voice is not supported on Aether. However, I most likely will have some sort of util to detect if you are using the voice binary.

## How does it work

Aether-Voice will be simply be a rust port of the C++ binder for [Opusscript](https://github.com/abalabahaha/opusscript/blob/master/src/opusscript_encoder.cpp). The Rust library, `audiopus_sys` will allow development of the voice addon to be much quicker as its simply a direct C/C++ binder for Rust.
