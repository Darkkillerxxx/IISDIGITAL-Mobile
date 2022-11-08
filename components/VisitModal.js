import React,{useState,useEffect} from "react";
import {StyleSheet,View,FlatList,Modal,TouchableOpacity,ScrollView} from 'react-native'
import SearchableDropdown from 'react-native-searchable-dropdown'; 
import AppButton from "./AppButton";
import AppContainer from './AppContainer'
import AppInput from './AppInput'
import AppText from "./AppText";
import AppCard from "./AppCard";
import AppTextBold from './AppTextBold'
import AsyncStorage from "@react-native-community/async-storage";
import { fetchAllDataFromTable } from "../Services";


const VisitModal = (props) =>{
    
    const [booths,setBooths] = useState([]);
    const [society,setSocietys] = useState([]);
    const [houses,setHouses] = useState([]);
    const [selectedBooth,setSelectedBooth] = useState(null);
    const [selectedSociety,setSelectedSociety] = useState(null);
    const [selectedHouse,setSelectedHouse] = useState(null);
    const [filterValue,setFilterValue] = useState({acNo:null,boothNo:null,vibhagNo:null,houseNo:null})

    const onBoothSelect = async(item) =>{
        setSelectedBooth(item)
        let filter = filterValue;
        filter.boothNo = item.id.split(' ')[1];
        console.log(filter)
        setFilterValue(filter);

        let societyList = JSON.parse(await AsyncStorage.getItem('societyList'))
        societyList = societyList.filter((society) => society.ST_CODE.toString() === item.id.split(' ')[2].toString() && society.AC_NO.toString() === item.id.split(' ')[0].toString() && society.BOOTH_NO.toString() === item.id.split(' ')[1].toString() )

        let societyListArrForSearchablePicklist = []
            societyList.forEach((society)=>{
                societyListArrForSearchablePicklist.push({
                    id:`${society.AC_NO} ${society.BOOTH_NO} ${society.ST_CODE} ${society.VIBHAG_NO}`,
                    name:`${society.VIBHAG_NO} - ${society.LOCALITYID} (${society.ENG_LOCALITYID})`
                })
            }) 
        setSocietys([...societyListArrForSearchablePicklist])
    }

    const onSocietyClicked = async(item) =>{
        setSelectedSociety(item);

        let votersList = await fetchAllDataFromTable('VoterList');

        let filter = filterValue;
        filter.vibhagNo = item.id.split(' ')[3];
        console.log(filter)
        setFilterValue(filter);

        let houseList = votersList.filter((voter) => voter.ST_CODE.toString() === item.id.split(' ')[2].toString() 
                                                  && voter.AC_NO.toString() === item.id.split(' ')[0].toString()
                                                  && voter.BOOTH_NO.toString() === item.id.split(' ')[1].toString() 
                                                  && voter.VIBHAG_NO.toString() === item.id.split(' ')[3].toString())
        
        let familyIdArr=[];
        let finalizedHouseList = [];

        houseList.forEach(house => {
            if(!familyIdArr.includes(house.HOUSE_NO)){
                familyIdArr.push(house.HOUSE_NO)
                finalizedHouseList.push({
                    id:`${house.AC_NO} ${house.BOOTH_NO} ${house.ST_CODE} ${house.VIBHAG_NO} ${house.HOUSE_NO}`,
                    name:`${house.HOUSE_NO}`
                })
            }
        });
        
        console.log(68,finalizedHouseList);
        setHouses([...finalizedHouseList])
    }

    const onHouseSelect = (item) =>{ 
        setSelectedHouse(item)
        let filter = filterValue;
        filter.houseNo = item.id.split(' ')[4];
        setFilterValue(filter);
        console.log(filter)
    }

    useEffect(()=>{
        async function fetchDataFromAsync(){ 
            let boothsList = JSON.parse(await AsyncStorage.getItem('boothList'))
            
            let boothListArrForSearchablePicklist = []
            boothsList.forEach((booth)=>{
                boothListArrForSearchablePicklist.push({
                    id:`${booth.AC_NO} ${booth.BOOTH_NO} ${booth.ST_CODE} `,
                    name:` ${booth.BOOTH_NO} - ${booth.PS_NAME} (${booth.ENG_PS_NAME})`
                })
            }) 
            console.log(135,boothListArrForSearchablePicklist);
            
            let userData = JSON.parse(await AsyncStorage.getItem('userData'))

            setBooths([...boothListArrForSearchablePicklist])
            
            //make this as a modular function later
            let filter = filterValue;
            filter.acNo = userData.accNo;;
            setFilterValue(filter);
        }

        fetchDataFromAsync();
    },[])

    const onFilterApplyClick = () => {
        props.applyFilter(filterValue)
    }

    return(
        <View style={{width:'100%',flex:1,padding:10,justifyContent:'flex-start'}}>
          <View style = {{width:'100%',padding:15,elevation:5,backgroundColor:'white',marginTop:10,marginRight:10,borderRadius:10}}>
        
             <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                 <AppTextBold style={{fontSize:16}}>Voter's Filter</AppTextBold>
             </View>

             <View style={{width:'100%',justifyContent:'center',marginVertical:10}}>
                 <AppTextBold style={{fontSize:14}}>Booth</AppTextBold>
             </View>
             <SearchableDropdown
                onItemSelect={(item) => {
                    onBoothSelect(item);
                }}
                containerStyle={{ padding: 5 }}
                itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: 'white',
                    borderColor: '#bbb',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                itemTextStyle={{ color: '#222' }} itemsContainerStyle={{ maxHeight: 140 }} items={booths}
                textInputProps={
                {
                    placeholder: "Search Booth",
                    value:selectedBooth?.name,
                    style: {
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 5,
                    }
                }}
            />

             {
                 society.length > 0 ? 
                 <>
                     <View style={{width:'100%',justifyContent:'center',marginVertical:10}}>
                         <AppTextBold style={{fontSize:14}}>Society</AppTextBold>
                     </View>
                     <SearchableDropdown
                            onItemSelect={(item) => {
                                onSocietyClicked(item);
                            }}
                            containerStyle={{ padding: 5 }}
                            itemStyle={{
                                padding: 10,
                                marginTop: 2,
                                backgroundColor: 'white',
                                borderColor: '#bbb',
                                borderWidth: 1,
                                borderRadius: 5,
                            }}
                            itemTextStyle={{ color: '#222' }} itemsContainerStyle={{ maxHeight: 140 }} items={society}
                            textInputProps={
                            {
                                placeholder: "Search Society",
                                value:selectedSociety?.name,
                                style: {
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                }
                            }}
                        />
                 </>
                 :
                 null
             }

             {
                 houses.length > 0 ?
                 
                 <>
                     <View style={{width:'100%',justifyContent:'center',marginVertical:10}}>
                         <AppTextBold style={{fontSize:14}}>House No.</AppTextBold>
                     </View>

                     <SearchableDropdown
                            onItemSelect={(item) => {
                                onHouseSelect(item);
                            }}
                            containerStyle={{ padding: 5 }}
                            itemStyle={{
                                padding: 10,
                                marginTop: 2,
                                backgroundColor: 'white',
                                borderColor: '#bbb',
                                borderWidth: 1,
                                borderRadius: 5,
                            }}
                            itemTextStyle={{ color: '#222' }} itemsContainerStyle={{ maxHeight: 140 }} items={houses}
                            textInputProps={
                            {
                                placeholder: "Search House",
                                value:selectedHouse?.name,
                                style: {
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                }
                            }}
                        />
                 </>
                
                 :
                 null
             }

         <AppButton 
             iconColor='white' 
             iconSize={24} 
             text="Apply Filter" 
             textStyle={{fontSize:18}}
             onPressButton={()=>onFilterApplyClick()}
             buttonStyle={{marginTop:15,backgroundColor:'#f49d34',width:'100%'}}  />

         <AppButton 
             iconColor='white' 
             iconSize={24} 
             text="Cancel" 
             textStyle={{fontSize:18,color:'#ff6961'}}
             onPressButton={()=> props.onCancel()}
             buttonStyle={{marginTop:15,borderWidth:1,borderColor:'#ff6961',backgroundColor:'white',width:'100%'}}  />
                   
                </View>
            </View>
    )

}

export default VisitModal