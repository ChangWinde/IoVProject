pragma solidity ^0.4.24;
contract IoC {
    //合约发起者
    address private minter;
	//合约发起者拥有的token
    uint private tokenOwned;
	//token对eth的汇率 * 1000
	uint private rate;
	//token对time的汇率 * 1000
	uint private t2tr;
	bool private nonce;
	
	event State(address user, string mes);
	event StateWithReturn(address user, string mes, uint value);
	event StateWithReturns(address user, string mes, uint value, uint[] values);
    
	//一辆汽车的信息结构
    struct CarInfo {
        uint locStart;
		uint locEnd;
        uint crowded;
        uint[] route;
        uint errorCount;
        uint timeStamp;
        uint token;
        bool used;
    }
    
	//普通购买信息者的信息结构
    struct NorBuyerInfo {
        uint moneyLimit;
        uint routeCommit;
        uint token;
        bool used;
    }
    
	//按时间购买信息者的信息结构
    struct TimeBuyerInfo {
        uint endTime;
        uint token;
        bool used;
    }
    
	//地址到汽车信息的映射
    mapping(address => CarInfo) cars;    
	//地址到普通购买者信息的映射
    mapping(address => NorBuyerInfo) norBuyers;
	//地址到按时间购买信息者的映射
    mapping(address => TimeBuyerInfo) timeBuyers;
    
    constructor() public {
        minter = msg.sender;
        tokenOwned = 1e42;
		rate = 1e12;
		t2tr = 60;
    }
    
	//判断请求者是否为发起者
    modifier restricted() {
        if(msg.sender == minter) _;
    }
	
	function changeRate(uint myRate, uint myT2tr) payable public restricted {
		require(myRate >= 0 && myT2tr >= 0);
		rate = (myRate == 0? rate: myRate);
		t2tr = (myT2tr == 0? t2tr: myT2tr);
		emit State(msg.sender, "change successfully");
	}
    
	//由交易发起者调用，给与汽车上传信息的权限
    function giveCarPermission(address user) public {
		if(msg.sender != minter) {emit State(user, "no permission!");return;}
		if(cars[user].used){emit State(user, "car used!");return;}
        //cars[user] = CarInfo({locStart : 0, locEnd : 0, crowded : 0, route : new uint8[](0), errorCount : 0, /*timeStamp : now,*/ token : 100, used : true});

		cars[user].route = new uint[](0);
		cars[user].errorCount = 0;
		cars[user].timeStamp = block.timestamp;
		tokenOwned -= 100;
		cars[user].token = 100;
		cars[user].used = true;
		emit State(user, "give car permission");
    }
	//由交易发起者调用，给与普通购买者买信息的权限
    function giveNorBuyerPermission(address user, uint initMoneyLimit, uint initToken) public restricted {
		if(norBuyers[user].used){emit State(user, "norBuyer used!");return;}
        //norBuyers[user] = NorBuyerInfo({moneyLimit : initMoneyLimit, token : initToken, routeCommit : 0, used : true});
		norBuyers[user].moneyLimit = initMoneyLimit;
		norBuyers[user].token = initToken;
		norBuyers[user].routeCommit = 0;
		norBuyers[user].used = true;
		emit State(user, "give norBuyer permission");
	}
	//由交易发起者调用，给与按时间购买者买信息的权限
    function giveTimeBuyerPermission(address user, uint plusTime) public restricted {
		if(timeBuyers[user].used){emit State(user, "timeBuyer used!");return;}
        //timeBuyers[user] = TimeBuyerInfo({endTime : now, token : 0, used :true});
		timeBuyers[user].endTime = block.timestamp + plusTime;
		timeBuyers[user].token = 0;
		timeBuyers[user].used = true;
		emit State(user, "give timeBuyer permission");
    }
	//由交易发起者调用，撤销汽车上传信息的权限
    function cancelCarPermission(address user) public {
		if(msg.sender != minter) {emit State(user, "no permission!");return;}
		if(!cars[user].used){emit State(user, "car not used!");return;}
        //require(cars[user].used);
		tokenOwned += cars[user].token;
		cars[user].token = 0;
        cars[user].used = false;
		emit State(user, "cancel car permission");
    }
	//由交易发起者调用，撤销普通购买者买信息的权限
    function cancelNorBuyerPermission(address user) public restricted {
		if(!norBuyers[user].used){emit State(user, "norBuyer not used!");return;}
		tokenOwned += norBuyers[user].token;
		norBuyers[user].token = 0;
        norBuyers[user].used = false;
		emit State(user, "cancel norBuyer permission");
    }
	//由交易发起者调用，撤销按时间购买者买信息的权限
    function cancelTimeBuyerPermission(address user) public restricted {
		if(!timeBuyers[user].used){emit State(user, "timeBuyer not used!");return;}
		tokenOwned += timeBuyers[user].token;
		timeBuyers[user].token = 0;
        timeBuyers[user].used = false;
		emit State(user, "cancel timeBuyer permission");
    }
    
    ///用于给timeBuyer购买时间
    function buyTime(uint timeValue) payable public {
        require(timeBuyers[msg.sender].used);
        if(timeBuyers[msg.sender].token < timeValue * t2tr / 1000) {
            emit State(msg.sender, "no enough money to but time");
        }
        timeBuyers[msg.sender].token -= timeValue * t2tr / 1000;
        timeBuyers[msg.sender].endTime += timeValue;
		emit State(msg.sender, "buy time successfully");
    }
	
	///上传信息以获取token，上传格式为：路段起点，路段终点，拥挤程度
    function uploadInfo(uint start, uint end, uint crowd) public {
        require(cars[msg.sender].used);
		if((cars[msg.sender].locStart == start && cars[msg.sender].locEnd == end) || (cars[msg.sender].locStart == end && cars[msg.sender].locEnd == start)) {
			emit State(msg.sender, "too close");
			return;
		}
		if(block.timestamp - cars[msg.sender].timeStamp < 10) {
			emit State(msg.sender, "too fast");
			return;
		}
		
		uint index = 0;
		for(uint i = 0; i < cars[msg.sender].route.length; ++i) {
			if(start == cars[msg.sender].route[i]) {
				index = i + 1;
				break;
			}
		}
		if(index != 0 && (cars[msg.sender].route[index] == end || (index > 1 && cars[msg.sender].route[index - 2] == end))) {
			if (cars[msg.sender].route[index] != end) {
				--index;
			}
			//emit StateWithReturns(msg.sender, "upload info", index, cars[msg.sender].route);
			uint r = index;
			for(uint l = 0; r < cars[msg.sender].route.length; ++l) {
				cars[msg.sender].route[l] = cars[msg.sender].route[r];
				++r;
			}
			cars[msg.sender].route.length -= index;
		}
		// else {
		uint[] memory ret = new uint[](5);
		ret[0] = cars[msg.sender].locStart;
		ret[1] = cars[msg.sender].locEnd;
		ret[2] = start;
		ret[3] = end;
		ret[4] = cars[msg.sender].crowded;
		emit StateWithReturns(msg.sender, "upload info", 0, ret);
		//}
        cars[msg.sender].locStart = start;
        cars[msg.sender].locEnd = end;
        cars[msg.sender].crowded = crowd;
        tokenOwned -= 10;
        cars[msg.sender].token += 10;
    }
	
	///上传路径信息，上传格式为：用户地址，选择的路径
    function uploadRoute(address user, uint[] routeChosen) public {
        require(norBuyers[msg.sender].used || timeBuyers[msg.sender].used);
        require(cars[user].used);
        cars[user].route = routeChosen;
        if(norBuyers[msg.sender].used) {
            norBuyers[msg.sender].routeCommit++;
        }
		emit StateWithReturns(msg.sender, "upload route", 0, cars[user].route);
    }
	
	///转账，参数为：接受者地址，转账金额
    function pay(address receiver, uint value) payable public {
		if(receiver == minter) {
			tokenOwned += value;
		} else if (cars[receiver].used) {
            cars[receiver].token += value;
        } else if (timeBuyers[receiver].used) {
            timeBuyers[receiver].token += value;
        } else if (norBuyers[receiver].used) {
            norBuyers[receiver].token += value;
        } else {emit State(receiver, "pay: receiver no permission");return;}
        if(msg.sender == minter && tokenOwned >= value) {
			tokenOwned -= value;
		} else if (cars[msg.sender].used && cars[msg.sender].token >= value) {
            cars[msg.sender].token -= value;
        } else if (timeBuyers[msg.sender].used && timeBuyers[msg.sender].token >= value) {
            timeBuyers[msg.sender].token -= value;
        } else if (norBuyers[msg.sender].used && norBuyers[msg.sender].token >= value) {
            norBuyers[msg.sender].token -= value;
        } else {
			if(receiver == minter) {
				tokenOwned -= value;
			} else if (cars[receiver].used) {
                cars[receiver].token -= value;
            } else if (timeBuyers[receiver].used) {
                timeBuyers[receiver].token -= value;
            } else if (norBuyers[receiver].used) {
                norBuyers[receiver].token -= value;
            }
			emit State(msg.sender, "pay: user no permission.");
			return;
        }
		emit State(receiver, "pay successfully.");
    }
	
	///获取账户的token数量
	function getToken() view public returns(uint) {
	    if(msg.sender == minter) {
	        return tokenOwned;
	    } else if(cars[msg.sender].used) {
            return cars[msg.sender].token;
        } else if (timeBuyers[msg.sender].used) {
            return timeBuyers[msg.sender].token;
        } else if (norBuyers[msg.sender].used) {
            return norBuyers[msg.sender].token;
        }
        return 0;
	}
	///用token换取以太币，参数为token的数量
    function token2eth(uint value) payable public {
        if(cars[msg.sender].used) {
			if (cars[msg.sender].token < value) {
				emit State(msg.sender, "no enough token for car");
				return;
			}
            cars[msg.sender].token -= value;
        } else if (timeBuyers[msg.sender].used) {
			if (timeBuyers[msg.sender].token < value) {
				emit State(msg.sender, "no enough token for time buyer");
				return;
			}
            timeBuyers[msg.sender].token -= value;
        } else if (norBuyers[msg.sender].used) {
			if (norBuyers[msg.sender].token < value) {
				emit State(msg.sender, "no enough token for normal buyer");
				return;
			}
            norBuyers[msg.sender].token -= value;
        }
		if (!msg.sender.send(value * rate / 1000)) {
			if(cars[msg.sender].used) {
				cars[msg.sender].token += value;
			} else if (timeBuyers[msg.sender].used) {
				timeBuyers[msg.sender].token += value;
			} else if (norBuyers[msg.sender].used) {
				norBuyers[msg.sender].token += value;
			}
			emit State(msg.sender, "we have no enough eth");
			return;
		}
		tokenOwned += value;
		emit StateWithReturn(msg.sender, "token2eth", value);
    }
	///用以太币换取token，参数为以太币的数量(wei)
    function eth2token(uint value) payable public {
		if (msg.value < value) {
			emit State(msg.sender, "no enough eth");
		}
        if(cars[msg.sender].used) {
            cars[msg.sender].token += value * 1000 / rate;
        } else if (timeBuyers[msg.sender].used) {
            timeBuyers[msg.sender].token += value * 1000 / rate;
        } else if (norBuyers[msg.sender].used) {
            norBuyers[msg.sender].token += value * 1000 / rate;
        } else {
			return;
		}
		tokenOwned -= value * 1000 / rate;
		emit StateWithReturn(msg.sender, "eth2token", value);
    }
	function empty() payable public {nonce = true;}
}
