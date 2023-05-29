export default function capitalize(word:string){
    if(typeof word !== 'string') return '';
    if(word.includes(' ')){
        let capitalized = '';
        word.split(' ').forEach((item)=> (capitalized += item[0].toUpperCase() + item.slice(1) + " "));
        return capitalized;
    }
    return (word[0].toUpperCase() + word.slice(1));
}