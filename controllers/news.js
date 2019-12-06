"use strict";
require('dotenv').config;

const mongoose = require("mongoose");
const News = require("../models/website/news")
const https = require('https')
const axios = require('axios')

async function saveNews(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK.",
        Data: null,
    };

    try {

        let element = req.body;

        await News.findOne({
            title: element.title
        }).then(data => {
            if (data) {
                console.log("duplicate title match: ", element.title)
                respObj.IsSuccess = false;
                respObj.Data = data;
                respObj.message = 'Duplicate';
                res.status(200).json(respObj);
            } else {
                let saveData = {
                    title: element.title,
                    description: element.description,
                    link: element.link,
                    image: element.image,
                    displayImage: element.image,
                    publishedAt: element.publishedAt,
                    masterId: req.body.masterId
                }

                let saveNews = new News(saveData).save();
                respObj.IsSuccess = true;
                respObj.Data = saveNews;
                respObj.message = 'New insert';
                res.status(200).json(respObj);
            }

        }).catch(err => {
            respObj.error = err
            respObj.message = err.message || "Error while processing db query",
                res.status(500).json(respObj)
        })
    } catch (err) {
        respObj.error = err
        respObj.message = err.message || "Error while processing db query",
            res.status(500).json(respObj)
    }
}

async function getNews(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK.",
        Data: null,
    };
    try {
        let news = await News.find({}).populate({
            path: 'masterId',
            model: 'Master',
            select: 'name -_id'
        })
        respObj.IsSuccess = true;
        respObj.Data = news
        res.status(200).json(respObj);
    } catch (err) {
        respObj.error = err
        respObj.message = err.message || "Error while processing db query",
            res.status(500).json(respObj)
    }
}

async function getNewsforMaster(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK.",
        Data: null,
    };
    try {
        let news = await News.find({}).sort({
            'publishedAt': 1
        })
        respObj.IsSuccess = true;
        respObj.Data = news
        res.status(200).json(respObj);
    } catch (err) {
        respObj.error = err
        respObj.message = err.message || "Error while processing db query",
            res.status(500).json(respObj)
    }
}

async function autoFetchNews(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK.",
        Data: null,
    };
    try {
        let query = req.body.query

        await axios.get('https://gnews.io/api/v3/search?q=' + query + '&token=' + process.env.newsToken)
            .then(function (response) {
                respObj.IsSuccess = true;
                respObj.Data = response.data;
                res.status(200).json(respObj);
            }).catch(function (error) {
                // handle error
                respObj.error = error
                respObj.message = error.message || "Error while processing db query",
                    res.status(500).json(respObj)
            })

    } catch (err) {
        respObj.error = err
        respObj.message = err.message || "Error while processing db query",
            res.status(500).json(respObj)
    }
}

async function saveAutoFetchQuery(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK.",
        Data: null,
    };

    let fetehedNews = req.body.object;

    fetehedNews.forEach(async element => {
        await News.findOne({
            title: element.title
        }).then(data => {
            if (data) {
                console.log("duplicate title match: ", element.title)
            } else {
                console.log('Insert news: ', element.title)
                let saveData = {
                    title: element.title,
                    description: element.description,
                    link: element.url,
                    isAutoFetch: true,
                    image: element.image,
                    displayImage: element.image,
                    publishedAt: element.publishedAt,
                    masterId: req.body.id
                }

                let saveNews = new News(saveData).save();
            }

            respObj.IsSuccess = true;
            respObj.Data = 'saved';
            res.status(200).json(respObj);
        }).catch(err => {
            respObj.error = err
            respObj.message = err.message || "Error while processing db query",
                res.status(500).json(respObj)
        });
    });
}

async function deleteNews(req, res) {
    let respObj = {
        IsSuccess: false,
        Message: "OK.",
        Data: null,
    };

    let newId = req.body.id;

    try {
        let deleteNews = await News.findOneAndDelete({
            '_id': mongoose.Types.ObjectId(newId)
        }).then(data => {
            respObj.IsSuccess = true;
            respObj.Data = data;
            respObj.message = 'Delete successfully';
            res.status(200).json(respObj);
        }).catch(err => {
            respObj.error = err
            respObj.message = err.message || "Error while processing db query",
                res.status(500).json(respObj)
        })

    } catch (err) {
        respObj.error = err
        respObj.message = err.message || "Error while processing db query",
            res.status(500).json(respObj)
    }
}

async function editNews(req, res) {
    try {
        let id = req.body.id;
        await News.findById({
            '_id': mongoose.Types.ObjectId(id)
        }, (err, data) => {
            if (err) {
                res.status(500).json({
                    IsSuccess: false,
                    message: err.message || "Error while processing db query",
                })
            } else {
                res.status(200).json({
                    IsSuccess: true,
                    Data: data
                })
            }
        });
    } catch (err) {
        res.status(500).json({
            IsSuccess: false,
            message: err.message || "Error while processing db query",
        })
    }
}

async function updateNews(req, res) {
    try {
        let updateObject = req.body.object;
        let newsId = req.body.id;

        let update = await News.findOne({
            '_id': mongoose.Types.ObjectId(newsId)
        });

        if (update) {
            update.title = updateObject.title,
                update.masterId = updateObject.masterId,
                update.description = updateObject.description,
                update.link = updateObject.link,
                update.displayImage = updateObject.image,
                update.image = updateObject.image

            update.save();

            res.status(200).json({
                IsSuccess: true,
                Data: updateNews,
                message: 'Updated successfully'

            })

        } else {
            res.status(500).json({
                IsSuccess: false,
                Data: null,
                message: "Error while processing db query",
            })
        }

    } catch (err) {
        res.status(500).json({
            IsSuccess: false,
            message: err.message || "Error while processing db query",
        })
    }
}

module.exports = {
    saveNews,
    getNews,
    getNewsforMaster,
    autoFetchNews,
    saveAutoFetchQuery,
    deleteNews,
    editNews,
    updateNews
}