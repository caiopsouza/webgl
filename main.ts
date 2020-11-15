import { flatten, vec3 } from "./math/vec";
import { get } from "./conn/http";

function uniform1f(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    name: string
) {
    const location = gl.getUniformLocation(program, name);
    return (value: number) => gl.uniform1f(location, value);
}

function createAttribute(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    name: string,
    values: vec3[]
) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(values), gl.STATIC_DRAW);

    var attr = gl.getAttribLocation(program, name);
    gl.vertexAttribPointer(attr, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attr);
}

function initProgram(gl: WebGLRenderingContext) {
    const program = gl.createProgram()!;
    if (!program) throw new Error(`Unable to create program.`);

    function loadShader(type: number, url: string) {
        const shader = gl.createShader(type);
        if (!shader) throw new Error(`Unable to create shader $type.`);

        gl.shaderSource(shader, get(url));
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw gl.getShaderInfoLog(shader);

        gl.attachShader(program, shader);
        return shader;
    }

    loadShader(gl.VERTEX_SHADER, "/shader.vert");
    loadShader(gl.FRAGMENT_SHADER, "/shader.frag");

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw gl.getProgramInfoLog(program);

    gl.useProgram(program);
    return program;
}

function main() {
    const canvas = document.querySelector<HTMLCanvasElement>("#gl-canvas");
    if (!canvas) throw new Error(`Unable to create canvas.`);

    const gl = canvas.getContext("webgl")!;
    if (!gl) throw new Error(`Unable to create GL context.`);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const program = initProgram(gl);

    const square = [
        vec3(0, 1, 0),
        vec3(1, 0, 0),
        vec3(-1, 0, 0),
        vec3(0, -1, 0),
    ];
    createAttribute(gl, program, "vPosition", square);

    let theta = uniform1f(gl, program, "theta");
    function render(input: HTMLInputElement) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        theta(parseFloat(input.value) * Math.PI);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, square.length);
    }

    var slide = document.getElementById("slide") as HTMLInputElement;
    if (!slide) throw new Error("Unable to find slide");

    render(slide);
    slide.oninput = (event) => render(event.target as HTMLInputElement);
}

window.onload = main;
