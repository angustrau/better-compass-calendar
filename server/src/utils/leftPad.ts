const leftPad = (input: string, padding: string, length: number) => {
    let output = input;
    while (output.length < length) {
        output = padding + output;
    }
    return output;
}

export = leftPad;