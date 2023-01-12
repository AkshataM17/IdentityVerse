//SPDX-License_Identifier: MIT
pragma solidity ^0.8.0;

contract LinkIdentity {

    mapping(address => string) public addressToCredentialsTwitter;
    mapping(string => address) public  CredentialsToAddressTwitter;

    mapping(address => string) public addressToCredentialsGithub;
    mapping(string => address) public  CredentialsToAddressGithub;

    mapping(address => string) public addressToCredentialsOrcid;
    mapping(string => address) public  CredentialsToAddressOrcid;

    address[] public registeredAddressesTwitter;
    string[] public registeredCredentialsTwitter;

    address[] public registeredAddressesGithub;
    string[] public registeredCredentialsGithub;

    address[] public registeredAddressesOrcid;
    string[] public registeredCredentialsOrcid;

    function LinkYourAddressToTwitter(string memory creds) public {

        require( (keccak256(abi.encodePacked(addressToCredentialsTwitter[msg.sender])) != keccak256(abi.encodePacked(creds))), "You are already registered");

        addressToCredentialsTwitter[msg.sender] = creds;
       
    }

    function showLinkedCredentialsTwitter(address) public view returns (string memory){
        return addressToCredentialsTwitter[msg.sender];
    }

    function LinkYourAddressToGithub(string memory creds) public {

        require( (keccak256(abi.encodePacked(addressToCredentialsGithub[msg.sender])) != keccak256(abi.encodePacked(creds))), "You are already registered");

        addressToCredentialsGithub[msg.sender] = creds;
       
    }

    function showLinkedCredentialsGithub(address) public view returns (string memory){
        return addressToCredentialsGithub[msg.sender];
    }

    function LinkYourAddressToOrcid(string memory creds) public {

        require( (keccak256(abi.encodePacked(addressToCredentialsOrcid[msg.sender])) != keccak256(abi.encodePacked(creds))), "You are already registered");

        addressToCredentialsOrcid[msg.sender] = creds;
       
    }

    function showLinkedCredentialsOrcid(address) public view returns (string memory){
        return addressToCredentialsOrcid[msg.sender];
    }

}