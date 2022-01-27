export class Usuario {

    static fromFirebase( user: any ) {
        return new Usuario(user.uid, user.nombre, user.email);
    }

    constructor(
        public uid: string | undefined,
        public nombre: string,
        public email: string | undefined | null,
    ) {}
}