const { exec } = require("child_process");
const path = require("path");

exports.runCompression = (input, output, format) => {
  return new Promise((resolve, reject) => {
    const absInput = path.resolve(input);
    const absOutput = path.resolve(output);

    // We mount the project root (.. from api) to /app in the container
    const projectRoot = path.resolve(__dirname, "..", "..");

    // Calculate paths relative to project root
    const relInput = path.relative(projectRoot, absInput).replace(/\\/g, "/");
    const relOutput = path.relative(projectRoot, absOutput).replace(/\\/g, "/");

    // Entrypoint is /bin/bash, so we pass the script path directly
    const command = `docker run --rm -v "${projectRoot}:/app" img-compress-engine /app/engine/compress.sh "/app/${relInput}" "/app/${relOutput}" "${format || ""}"`;

    exec(command, (error, stdout, stderr) => {
      // Always log output for debugging
      console.log("[Engine Command]:", command);
      if (stderr) console.error("[Engine Stderr]:", stderr);
      if (stdout) console.log("[Engine Stdout]:", stdout);

      if (error) {
        const fullError = `Command failed with exit code ${error.code}\nStderr: ${stderr}\nStdout: ${stdout}`;
        return reject(new Error(fullError));
      }
      resolve(stdout);
    });
  });
};
