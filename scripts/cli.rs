use std::{
    env,
    io::{Error, ErrorKind},
    process::{Command, Stdio},
};

fn not_found() -> Error {
    Error::new(ErrorKind::NotFound, "JavaScript 代码未找到")
}

fn main() -> Result<(), Error> {
    let js_path = env::current_exe()?
        .parent()
        .ok_or_else(not_found)?
        .join("fastwd.cjs");
    if !js_path.exists() {
        return Err(not_found());
    }
    let status = Command::new("node")
        .arg(js_path)
        .stdin(Stdio::inherit())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status();
    match status {
        Ok(_) => {}
        Err(e) => {
            return Err(e);
        }
    }
    Ok(())
}
