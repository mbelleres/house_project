class House {
    constructor(name) {
        this.name = name;
        this.rooms = [];
    }

    addRoom(name, area) {
        this.rooms.push(new Room(name, area));
    }
}

class Room {
    constructor(name, area) {
        this.name = name;
        this.area = area;
    }
}

class HouseService {
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';
    static getAllHouses() {
        return $.get(this.url);
    }

    static getHouse(id) {
        return $.get(this.url + `/${id}`);
    }

    static createHouse(house) {
        return $.post(this.url, house);
    }

    static updateHouse(house) {
        return $.ajax({
            url: this.url + `/${house._id}`,
            dataType: 'json',
            data: JSON.stringify(house),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteHouse(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static houses;

    static getAllHouses() {
        HouseService.getAllHouses().then(houses => this.render(houses)).catch(error => console.error(error));
    }

    static render(houses) {
        this.houses = houses;
        $('#app').empty();
        for (let house of houses) {
            $('#app').prepend(
                `<div id="${house._id}" class="card">
                    <div class="card-header">
                        <h2>${house.name}</h2>
                        <button class="btn btn-danger delete-house-btn" data-house-id="${house._id}">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${house._id}-room-name" class ="form-control" placeholder="Room Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${house._id}-room-area" class ="form-control" placeholder="Room Area">
                                </div>
                            </div>
                            <button id="${house._id}-new-room" class="btn btn-primary form-control add-room-btn">Add</button>
                        </div>
                    </div>
                </div> <br>`
            );
            for (let room of house.rooms) {
                $(`#${house._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                        <span id="area-${room._id}"><strong>Area: </strong> ${room.area}</span>
                        <button class="btn btn-danger delete-room-btn" data-house-id="${house._id}" data-room-id="${room._id}">Delete Room</button>
                    </p>`
                );
            }
        }
    }

    static addRoom(houseId) {
        // Add room logic here
    }

    static deleteHouse(houseId) {
        // Delete house logic here
    }

    static deleteRoom(houseId, roomId) {
        // Delete room logic here
    }
}

$(document).ready(function () {
    DOMManager.getAllHouses();

    // Event delegation for dynamic elements
    $('#app').on('click', '.delete-house-btn', function () {
        const houseId = $(this).data('house-id');
        DOMManager.deleteHouse(houseId);
    });

    $('#app').on('click', '.add-room-btn', function () {
        const houseId = $(this).attr('id').split('-')[0];
        DOMManager.addRoom(houseId);
    });

    $('#app').on('click', '.delete-room-btn', function () {
        const houseId = $(this).data('house-id');
        const roomId = $(this).data('room-id');
        DOMManager.deleteRoom(houseId, roomId);
    });
});