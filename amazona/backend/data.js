import bcrypt from 'bcryptjs'
const data ={
    users:[
        {
            name:'Daniel',
            email:'admin@example.com',
            password: bcrypt.hashSync('1234',8),
            isAdmin:true,
        },
        {
            name:'Adi',
            email:'user@example.com',
            password: bcrypt.hashSync('1234',8),
            isAdmin:false,
        }
    ],
    products:
    [
        {
        name:'Nike Slime Shirt ',
        category:'Shirts',
        image:'/images/p1.jpg',
        price:120,
        countInStock:10,
        brand:'Nike',
        rating:4.5,
        numReviews:10,
        description: 'high quality product'
    },
    {
        name:'Adidas Fit Shirt ',
        category:'Shirts',
        image:'/images/p2.jpg',
        price:320,
        countInStock:20,
        brand:'Adidas',
        rating:4.0,
        numReviews:10,
        description: 'high quality product'
    },
    {
        name:'Lacost Free Shirt ',
        category:'Shirts',
        image:'/images/p3.jpg',
        price:220,
        countInStock:0,
        brand:'Lacost',
        rating:4.8,
        numReviews:17,
        description: 'high quality product'
    },
    {
        name:'Nike Slime Pant ',
        category:'Pants',
        image:'/images/p4.jpg',
        price:78,
        countInStock:22,
        brand:'Nike',
        rating:4.5,
        numReviews:14,
        description: 'high quality product'
    },
    {
        name:'Puma Slime Pant ',
        category:'Pants',
        image:'/images/p5.jpg',
        price:65,
        countInStock:1,
        brand:'Puma',
        rating:4.5,
        numReviews:10,
        description: 'high quality product'
    },
    {
        name:'Adidas Fit pant ',
        category:'pants',
        image:'/images/p6.jpg',
        price:139,
        countInStock:14,
        brand:'Adidas',
        rating:4.5,
        numReviews:15,
        description: 'high quality product'
    },
]
}
export default data;