'use strict';

let Promise = require('bluebird');
let models = require('./../models');
let config = require('../config/environments').config;

var mandrill = require('mandrill-api/mandrill');


module.exports = class Mail {

  applicationDone(userEmail, userStatus, options) {

    var to;
    var message = '';

    if ( process.env.NODE_ENV !== 'production' ) {
      to = [{
        'email': 'tom.coquereau@gmail.com',
        'name': 'Tom',
        'type': 'to'
      }];
    } else {
      to = [{
        'email': userEmail,
        'type': 'to'
      }];
    }

    if (userStatus === 'entre') {
      message = `
        <p>Merci d’avoir candidaté au Programme Entrepreneur Ticket for Change, nous serions ravis d’avoir ton retour sur cette expérience, par <a href="https://lombardmorgane.typeform.com/to/XGENhn">ici</a>.</p>
        <p>L’annonce des résultats de pré-sélection sera envoyée par mail le 26 avril.</p>
        <p>En attendant, n’hésite pas à nous suivre sur les réseaux sociaux (Facebook, Twitter et si ce n’est pas encore fait à découvrir notre MOOC “Devenir entrepreneur du changement” par <a href="https://fr.coursera.org/learn/entrepreneur-changement">ICI</a> !</p>
        <p>A très vite!</p>
        <p>L'équipe Ticket for Change"</p>
      `;

    } else if (userStatus === 'intra') {
      message = `
        <p>Merci beaucoup pour votre candidature !</p>
        <p>Votre dossier de candidature sera étudié par 2 membres du comité de sélection. Nous vous communiquerons sous 10 jours si votre candidature a été présélectionnée et nous vous proposerons dans ce cas des dates afin de réaliser un entretien par visioconférence.</p>
        <p>A bientôt !</p>
        <p>L'équipe Ticket for Change"</p>
      `;
    }

    // Create the message's structure
    var params = {
      message: {
        'html': message,
        'subject': 'Merci d\'avoir candidaté au Tour Ticket for Change 2015 !',
        'from_email': mandrill.ticket.config.email,
        'from_name': 'TicketForChange',
        'to': to,
        'headers': {
          'Reply-To': mandrill.ticket.config.email
        }
      },
      async: false,
      ip_pool: 'Main Pool',
      send_at: null
    };

    mandrill.ticket.client.messages.send(params, function(result) {
      // Cool bro, but it's async yo
    }, function(e) {
      // It blew, too bad
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });

  }

  resetEmail(to, resetUrl) {

    if ( process.env.NODE_ENV !== 'production' ) {
      to = [{
        'email': 'tom.coquereau@gmail.com',
        'type': 'to'
      }];
    }

    var message = `<p>Voici le lien qui te permettra de réinitialiser ton mot de passe</p><p><a href="${config.api.protocol || 'http'}://${resetUrl}">Réinitialiser mon mot de passe</a></p>`;

    // Create the message's structure
    var params = {
      message: {
        'html': message,
        'subject': 'Réinitialisation de ton mot de passe',
        'from_email': mandrill.ticket.config.email,
        'from_name': 'TicketForChange',
        'to': to,
        'headers': {
          'Reply-To': mandrill.ticket.config.email
        }
      },
      async: false,
      ip_pool: 'Main Pool',
      send_at: null
    };

    mandrill.ticket.client.messages.send(params, function(result) {
      // Cool bro, but it's async yo
    }, function(e) {
      // It blew, too bad
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });

  }

};
