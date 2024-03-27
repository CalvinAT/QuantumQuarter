class property {
    constructor() {
        this.id = null;
        this.agent = null;
        this.title = null;
        this.desc = null;
        this.type = null;
        this.area = null;
        this.price = null;
        this.bedroomCount = null;
        this.bathroomCount = null;
        this.landArea = null;
        this.garage = null;
        this.floorLevel = null;
        this.listingDate = null;
        this.approvedDate = null;
        this.status = null;
    }
}

class propertyBuilder {
    constructor(id, agent, title, type, desc, area, price, listingDate, approvedDate, status){
        this.property = new property();
        this.property.id = id;
        this.property.agent = agent;
        this.property.title = title;
        this.property.desc = desc;
        this.property.area = area;
        this.property.type = type;
        this.property.area = type;
        this.property.price = price;
        this.listingDate = listingDate;
        this.approvedDate = approvedDate;
        this.status = status;
    }

    addBedroom(count){
        this.property.bedroomCount = count;
        return this;
    }

    addBathroom(count){
        this.property.bathroomCount = count;
        return this;
    }

    addLandArea(area){
        this.property.landArea = area;
        return this;
    }

    addGarage(count){
        this.property.garage = count;
        return this;
    }

    addFloorLevel(level){
        this.property.floorLevel = level;
        return this;
    }

    build(){
        return this.property;
    }
}

module.exports = propertyBuilder;