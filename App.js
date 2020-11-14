import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, StyleSheet, Button, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native'
import axios from 'axios';

const Input = (props) => {
  return(
    <View style={styles.textInput}>
      <Text>{props.text} : </Text>
      <TextInput 
        onChangeText = {props.onChangeText}
        value = {props.namaProduk}
        placeholder = {props.placeholder}
        keyboardType = {props.keyboardType}
      />
        
    </View>
  )
}

const ListData = ({id, namaProduk, harga, keterangan, jumlah, onPressDelete, onPressUpdate}) => {
  return (
    <View style = {{marginBottom : 10, backgroundColor : '#dee0e3', flexDirection : 'row'}}>
      <View>
        <Text>Nama Produk : {namaProduk}</Text>
        <Text>Harga Produk : {harga}</Text>
        <Text>Jumlah Produk : {jumlah}</Text>
        <Text>Ket Produk : {keterangan}</Text>
      </View>
      <View style = {{flex : 1, flexDirection : 'row', justifyContent : 'flex-end', alignItems : 'center'}}>
        <TouchableOpacity>
          <Text style = {{paddingHorizontal : 30, color : 'red'}} onPress= {onPressDelete }>X</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text tyle = {{paddingHorizontal : 30 }} onPress = {onPressUpdate}>EDIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}




const Crud = () => {
  const [data, setData] = useState([]);
  const [namaProduk, setNamaProduk] = useState('');
  const [harga, setHarga] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [itemID, setItemId] = useState()
  const [button, setButton] = useState('SUBMIT');
  
  const BASE_URL = 'http://10.0.2.2:3000/produk';


  const getItem = (item) => {
    setHarga(item.harga);
    setJumlah(item.jumlah);
    setKeterangan(item.keterangan);
    setNamaProduk(item.namaProduk);
    setButton('UPDATE')
    setItemId(item.id)
  }

  const getData = async () => {
    try{
      const res = await axios.get(BASE_URL);
      setData(res.data)
    }catch(err) {
      console.warn(err)
    }
  }

  const postData = () => {
    const data = {
      namaProduk,
      harga,
      jumlah,
      keterangan
    }
    if(namaProduk.length == 0 || harga.length == 0 || jumlah.length == 0 || keterangan.length == 0){
      alert("semua field harus di isi")
    }else{
      if(button === "SUBMIT"){
        try{
          axios.post(BASE_URL, data)
          .then(() => {
              alert("Data Berhasil Tersimpam")
              setHarga('');
              setJumlah('');
              setKeterangan('');
              setNamaProduk('');
              getData();
            })
        }catch(err) {
          console.warn(err)
        }
      }else{
        try{
          axios.put(BASE_URL+`/${itemID}`, data)
          .then(() => {
              alert("Data Berhasil Terupdate")
              setHarga('');
              setJumlah('');
              setKeterangan('');
              setNamaProduk('');
              setButton('SUBMIT')
              getData();
            })
        }catch(err) {
          console.warn(err)
        }
      }
    }
  }

  const deleteItem = (item) => {
    try{
      axios.delete(BASE_URL+`/${item.id}`)
      .then(() => {
          alert("Data Berhasil Terdelete")
          // setHarga('');
          // setJumlah('');
          // setKeterangan('');
          // setNamaProduk('');
          getData();
        })
    }catch(err) {
      console.warn(err)
    }
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <View style = {{flex : 1}}>
      <Input 
        text = "Nama Produk"
        onChangeText = {(value) => setNamaProduk(value)}
        namaProduk = {namaProduk}
        placeholder = "Nama Produk"
      />
      <Input 
        text = "Harga Produk"
        onChangeText = {(value) => setHarga(value)}
        namaProduk = {harga}
        placeholder = "Harga"
        keyboardType = "phone-pad"
      />
      <Input 
        text = "Jumlah Produk"
        onChangeText = {(value) => setJumlah(value)}
        namaProduk = {jumlah}
        placeholder = "Jumlah"
        keyboardType = "phone-pad"
      />
      <Input 
        text = "Keterangan"
        onChangeText = {(value) => setKeterangan(value)}
        namaProduk = {keterangan}
        placeholder = "Keterangan"
      />

      <Button title = {button} onPress={postData}/>
      <Text>List Produk : </Text>
      <ScrollView>  
        {data.map(value => {
          return (
            <ListData 
              key = {value.id}
              namaProduk = {value.namaProduk}
              harga = {value.harga}
              jumlah = {value.harga}
              keterangan = {value.keterangan}
              onPressUpdate = {() => getItem(value)}
              onPressDelete = {() => {
                
                Alert.alert(
                'Peringatan',
                'Anda yakin akan menghapus produk ini ?',
                [
                  {
                    text : 'TIDAK'
                  },
                  {
                    text : 'YA',
                    onPress : () => deleteItem(value)
                  }
                ]

                )
              }}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  textInput:{
    // backgroundColor : 'yellow',
    marginBottom : 10,
    borderColor : 'black'
  }
})



export default Crud;
