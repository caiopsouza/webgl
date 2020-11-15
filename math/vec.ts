export type vec3 = [number, number, number];

export function vec3(a: number, b: number, c: number): vec3 {
    return [a, b, c];
}

export function flatten(arr: vec3[]): Float32Array {
    return new Float32Array(arr.flat(1));
}

export function lerp(u: vec3, v: vec3, s: number): vec3 {
    return [0, 1, 2].map((i) => (1.0 - s) * u[i] + s * v[i]) as vec3;
}

export type vec4 = [number, number, number, number];

export function vec4(a: number, b: number, c: number, d: number): vec4 {
    return [a, b, c, d];
}
