FROM ubuntu:bionic

# This seems to be required on bionic to stop apt asking for user input
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        cmake \
        curl 
 
# Get the wasi SDK. It contains all compiler tools for C & C++. 
# Also contains wasi sysroot for anyone wishing to explore using WASI during workshop
RUN curl -sS -L -O https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-10/wasi-sdk_10.0_amd64.deb && \
    dpkg -i wasi-sdk_10.0_amd64.deb && rm -f wasi-sdk_10.0_amd64.deb
# Add all the wasi-sdk tools to path (such as clang, clang++, wasm-ld)
ENV PATH="/opt/wasi-sdk/bin:${PATH}"

#Download rust toolchain & install rust compiler
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain stable -y 
# Make sure toolchain is up to date, and add wasm32 as a build target
RUN ~/.cargo/bin/rustup update && ~/.cargo/bin/rustup target add wasm32-unknown-unknown
# Add all the rust tools to path (rustc, cargo, rustup)
ENV PATH="~/.cargo/bin:${PATH}"

# Download node js
RUN curl -sS -L -O https://nodejs.org/dist/v14.15.0/node-v14.15.0-linux-x64.tar.xz && \
    tar xf node-v14.15.0-linux-x64.tar.xz
# Add it to the path
ENV PATH="/node-v14.15.0-linux-x64/bin:${PATH}"

# Prepare the assembly script compiler
COPY package*.json ./
RUN npm install
# Add to path
ENV PATH="/node_modules/.bin:${PATH}"

# Get the wabt tools
RUN curl -sS -L -O https://github.com/WebAssembly/wabt/releases/download/1.0.19/wabt-1.0.19-ubuntu.tar.gz && \
    tar -xzf wabt-1.0.19-ubuntu.tar.gz
# Add to path
ENV PATH="/wabt-1.0.19/bin:${PATH}"

RUN apt-get clean \
 && rm -rf /var/lib/apt/lists/*
