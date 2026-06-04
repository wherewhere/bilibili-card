if (!Array.prototype.includes) {
    Array.prototype.includes = function (value) { return this.indexOf(value) !== -1; }
}

if (!String.prototype.trimStart) {
    if (!String.prototype.trimLeft) {
        String.prototype.trimLeft = function () { return this.replace(/^[\p{White_Space}\uFEFF]+/u, ''); }
    }
    String.prototype.trimStart = String.prototype.trimLeft;
}

if (!String.prototype.trimEnd) {
    if (!String.prototype.trimRight) {
        String.prototype.trimRight = function () { return this.replace(/^[\p{White_Space}\uFEFF]+/u, ''); }
    }
    String.prototype.trimEnd = String.prototype.trimRight;
}