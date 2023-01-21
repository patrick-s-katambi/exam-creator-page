export class UserModel {
    private name: string = "Patrick Simon";

    get() {
        return { name: this.name };
    }
}
