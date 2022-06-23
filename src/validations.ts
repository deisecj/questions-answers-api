export class Validations {

    validateSignUp(email: string, password: string): Promise<Array<String>> {
      
        const emailFormat = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

        return new Promise((resolve, reject) => {
            try {
                let errors: Array<String> = [];

                if (email === '') {  
                    errors.push("email is required");
                } else if (!email.match(emailFormat)) {
                    errors.push("email format is invalid");
                }
                
                if (password === '') {
                    errors.push("password is required");
                } else if (password.length > 15) {  
                    errors.push("password length must not exceed 15 characters");
                } else if (!password.match(strongPassword)) {
                    errors.push("your password must be have at least: 8 characters long, 1 uppercase, 1 lowercase character and 1 number"); 
                }
                resolve(errors);
            } catch (e) {
                reject(e);
            }
        });               
    }

    validateSignIn(email: string, password: string): Promise<Array<String>> {
        return new Promise((resolve, reject) => {
            try {
                let errors: Array<String> = [];

                if (email === '') {  
                    errors.push("email is required");
                }

                if (password === '') {
                    errors.push("password is required");
                }
                resolve(errors);
            } catch (e) {
                reject(e);
            }
        });
    }

    validateQuestion(title: string, description: string): Promise<Array<String>> {
        return new Promise((resolve, reject) => {
            try {
                let errors: Array<String> = [];

                if (title === '') {  
                    errors.push("title is required");
                }

                if (description === '') {
                    errors.push("description is required");
                }
                resolve(errors);
            } catch (e) {
                reject(e);
            }
        });
    }

    validateAnswer(description: string): Promise<Array<String>> {
        return new Promise((resolve, reject) => {
            try {
                let errors: Array<String> = [];

                if (description === '') {
                    errors.push("description is required");
                }
                resolve(errors);
            } catch (e) {
                reject(e);
            }
        });
    }
}
