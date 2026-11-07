package main

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}

	jsPath := filepath.Join(filepath.Dir(exePath), "core.cjs")

	if _, err := os.Stat(jsPath); err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			return errors.New("JavaScript 代码未找到")
		}
		return err
	}

	cmd := exec.Command("node", jsPath)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		if exitErr, ok := errors.AsType[*exec.ExitError](err); ok {
			os.Exit(exitErr.ExitCode())
		}
		return err
	}
	return nil
}
