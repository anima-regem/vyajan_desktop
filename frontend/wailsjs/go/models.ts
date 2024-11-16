export namespace oauth {
	
	export class UserInfo {
	    id: string;
	    email: string;
	    verified_email: boolean;
	    name: string;
	    given_name: string;
	    family_name: string;
	    picture: string;
	    locale: string;
	
	    static createFrom(source: any = {}) {
	        return new UserInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.email = source["email"];
	        this.verified_email = source["verified_email"];
	        this.name = source["name"];
	        this.given_name = source["given_name"];
	        this.family_name = source["family_name"];
	        this.picture = source["picture"];
	        this.locale = source["locale"];
	    }
	}

}

