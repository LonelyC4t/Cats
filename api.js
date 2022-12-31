class Api {
    constructor(name){
        this.url = "https://cats.petiteweb.dev/api/single/";
        this.name = name;
    };
    getCats() {
        return fetch(`${this.url}${this.name}/show`)
    };
    getCat(id) {
        return fetch(`${this.url}${this.name}/show/${id}`)
    };
    getCatsIds(){
        return fetch(`${this.url}${this.name}/ids`)
    };

    addCat(bod){
        
        return fetch(`${this.url}${this.name}/add`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(bod)
        })
        
    };

    updCat(chanangePartCat, id){
        fetch (`${this.url}${this.name}/update/${id}`, {
            method:"PUT",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify(chanangePartCat)
        });
    };

    delCat(id){
        return fetch(`${this.url}${this.name}/delete/${id}`, {
            method: "DELETE"
        })
    };
};




 