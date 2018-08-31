pragma solidity ^0.4.24;
contract IoC {
    address private minter;
    uint private tokenOwned;
    
    struct info {
        uint token;
        bool used;
    }
    
    struct CarInfo {
        uint8[2] location;
        uint crowded;
        uint8[] route;
        uint8 errorCount;
        uint timeStamp;
        uint token;
        bool used;
    }
    
    struct NorBuyerInfo {
        uint moneyLimit;
        uint8 routeCommit;
        uint token;
        bool used;
    }
    
    struct TimeBuyerInfo {
        uint endTime;
        uint token;
        bool used;
    }
    
    mapping(address => CarInfo) cars;    
    mapping(address => NorBuyerInfo) norBuyers;
    mapping(address => TimeBuyerInfo) timeBuyers;
    
    constructor() public {
        minter = msg.sender;
        tokenOwned = 100000000;
    }
    
    modifier restricted() {
        if(msg.sender == minter) _;
    }
    
    function giveCarPermission(address user) public restricted {
        require(!cars[user].used);
        cars[user] = CarInfo({location : [0,0], crowded : 0, route : new uint8[](0), errorCount : 0, timeStamp : now, token : 10, used : true});
    }
    function giveNorBuyerPermission(address user, uint initMoneyLimit, uint initToken) public restricted {
        require(!norBuyers[user].used);
        norBuyers[user] = NorBuyerInfo({moneyLimit : initMoneyLimit, token : initToken, routeCommit : 0, used : true});
    }
    function giveTimeBuyerPermission(address user, uint) public restricted {
        require(!timeBuyers[user].used);
        timeBuyers[user] = TimeBuyerInfo({endTime : now, token : 0, used :true});
    }
    function cancelCarPermission(address user) public restricted {
        require(cars[user].used);
        cars[user].used = false;
    }
    function cancelNorBuyerPermission(address user) public restricted {
        require(norBuyers[user].used);
        norBuyers[user].used = false;
    }
    function cancelTimeBuyerPermission(address user) public restricted {
        require(timeBuyers[user].used);
        timeBuyers[user].used = false;
    }
    function uploadInfo(uint8 start, uint8 end, uint crowd) public  {
        require(cars[msg.sender].used);
        cars[msg.sender].location = [start, end];
        cars[msg.sender].crowded = crowd;
        tokenOwned -= 10;
        cars[msg.sender].token += 10;
    }
    function uploadRoute(address user, uint8[] routeChosen) public {
        require(norBuyers[msg.sender].used || timeBuyers[msg.sender].used);
        require(cars[user].used);
        cars[user].route = routeChosen;
        if(norBuyers[msg.sender].used) {
            norBuyers[msg.sender].routeCommit++;
        }
    }
    function getCrowdedRoad(uint8 start, uint8 end) public returns(uint crowd) {
        crowd = 0;
    }
    function pay(address receiver, uint value) public payable {
        if(cars[receiver].used) {
            cars[receiver].token -= value;
        } else if (timeBuyers[receiver].used) {
            timeBuyers[receiver].token -= value;
        } else if (norBuyers[receiver].used) {
            norBuyers[receiver].token -= value;
        } else {return;}
        if(cars[msg.sender].used) {
            cars[msg.sender].token += value;
        } else if (timeBuyers[msg.sender].used) {
            timeBuyers[msg.sender].token += value;
        } else if (norBuyers[msg.sender].used) {
            norBuyers[msg.sender].token += value;
        } else {
            if(cars[receiver].used) {
                cars[receiver].token += value;
            } else if (timeBuyers[receiver].used) {
                timeBuyers[receiver].token += value;
            } else if (norBuyers[receiver].used) {
                norBuyers[receiver].token += value;
            }
        }
    }
    //转账不会写！
    function token2eth(uint value) {
        if(cars[msg.sender].used) {
            cars[msg.sender].token -= value;
        } else if (timeBuyers[msg.sender].used) {
            timeBuyers[msg.sender].token -= value;
        } else if (norBuyers[msg.sender].used) {
            norBuyers[msg.sender].token -= value;
        }
    }
    //还是不会写！
    function eth2token(uint value) {
        if(cars[msg.sender].used) {
            cars[msg.sender].token += value;
        } else if (timeBuyers[msg.sender].used) {
            timeBuyers[msg.sender].token += value;
        } else if (norBuyers[msg.sender].used) {
            norBuyers[msg.sender].token += value;
        }
    }
}


